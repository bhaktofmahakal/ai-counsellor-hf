import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedUniversities, cacheUniversities } from '@/lib/upstash';
import { semanticUniversitySearch, generateUniversityRecommendations } from '@/lib/embeddings';
import { calculateMatchScore } from '@/lib/calculateMatchScore';
import { fetchExternalUniversities } from '@/lib/externalUniversities';
import { getMatchCategory } from '@/lib/matchUtils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const userEmail = searchParams.get('userEmail');
    const useRAG = searchParams.get('rag') === 'true';

    console.log(`🔍 [API/Universities] Query - RAG: ${useRAG}, Country: ${country}, Search: ${search}, User: ${userEmail}`);

    const cacheKey = `${userEmail || 'guest'}:${country || 'all'}:${search || 'all'}:${useRAG}`;

    // const cached = await getCachedUniversities(cacheKey);
    // if (cached) {
    //   console.log(`✅ [API/Universities] Cache hit: ${cached.length} universities`);
    //   return NextResponse.json(cached);
    // }

    const user = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null;
    console.log(`👤 [API/Universities] User found: ${user ? 'Yes' : 'No'} (${userEmail})`);

    let universities = [];

    if (useRAG && user) {
      console.log(`🤖 [API/Universities] Executing RAG branch`);

      if (search) {
        const ragResults = await semanticUniversitySearch(search, user, 20);
        const universityIds = ragResults.map(r => r.id);

        const fetchedUniversities = await prisma.university.findMany({
          where: { id: { in: universityIds } },
        });

        universities = universityIds
          .map(id => fetchedUniversities.find(u => u.id === id))
          .filter(Boolean);

        // Fallback if RAG returned nothing or IDs didn't match
        if (universities.length === 0) {
          console.log('🔄 [API/Universities] RAG fallback to standard search');
          universities = await prisma.university.findMany({
            where: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } }
              ]
            },
            take: 10
          });
        }
      } else {
        const recommendations = await generateUniversityRecommendations(user);
        const universityIds = recommendations.map(r => r.id);

        const fetchedUniversities = await prisma.university.findMany({
          where: { id: { in: universityIds } },
        });

        universities = universityIds
          .map(id => fetchedUniversities.find(u => u.id === id))
          .filter(Boolean);

        // Fallback to top ranked if no recommendations
        if (universities.length === 0) {
          universities = await prisma.university.findMany({
            orderBy: { rank: 'asc' },
            take: 10
          });
        }
      }
    } else {
      const where: any = {};
      if (country) where.country = country;

      const searchLower = (search || '').toLowerCase();

      // 1. Get from local DB (Rich data)
      let localUniversities = await prisma.university.findMany({
        where: {
          ...where,
          ...(search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
              { programs: { hasSome: [search] } },
            ]
          } : {})
        },
        orderBy: [{ rank: 'asc' }, { name: 'asc' }],
        take: 40,
      });

      // 2. Supplement with Hipolabs if search or country is provided
      let externalUniversities: any[] = [];
      if (search || country) {
        console.log(`🌐 [API/Universities] Supplementing with Hipolabs: q=${search}, c=${country}`);
        externalUniversities = await fetchExternalUniversities(search || undefined, country || undefined);
      }

      // Merge and remove duplicates by name
      const seenNames = new Set(localUniversities.map(u => u.name.toLowerCase()));
      const uniqueExternal = externalUniversities.filter(u => !seenNames.has(u.name.toLowerCase()));

      universities = [...localUniversities, ...uniqueExternal].slice(0, 80);
    }

    // Inject Match Scores if user exists
    if (user) {
      universities = universities.map(uni => {
        const matchScore = calculateMatchScore(user, uni);
        const category = getMatchCategory(matchScore);

        const labels = [...(uni.tags || [])];
        labels.push(category);

        return {
          ...uni,
          matchScore,
          tags: Array.from(new Set(labels)) // Deduplicate
        };
      });

      // Sort by Match Score descending
      universities.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    console.log(`✅ [API/Universities] Returning ${universities.length} results`);
    // Skip caching for search results to ensure freshness while debugging
    if (!search) {
      await cacheUniversities(cacheKey, universities);
    }
    return NextResponse.json(universities);
  } catch (error: any) {
    console.error('❌ [API/Universities] CRITICAL ERROR:', error.message);
    try {
      const fallback = await prisma.university.findMany({ take: 5 });
      return NextResponse.json(fallback);
    } catch (e) {
      return NextResponse.json([]);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const university = await prisma.university.create({
      data: body,
    });

    console.log(`✅ [API/Universities] Created university: ${university.name}`);
    return NextResponse.json(university);
  } catch (error) {
    console.error('❌ [API/Universities] Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}

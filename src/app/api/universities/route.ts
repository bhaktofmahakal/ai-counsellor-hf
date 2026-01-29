import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { semanticUniversitySearch, generateUniversityRecommendations } from '@/lib/embeddings';
import { calculateMatchScore } from '@/lib/calculateMatchScore';
import { fetchExternalUniversities } from '@/lib/externalUniversities';
import { getMatchCategory } from '@/lib/matchUtils';
import { cacheUniversities } from '@/lib/upstash';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const useRAG = searchParams.get('rag') === 'true';

    // Get user from session rather than query param
    const user = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

    const cacheKey = `${user?.email || 'guest'}:${country || 'all'}:${search || 'all'}:${useRAG}`;

    let universities = [];

    if (useRAG && user) {
      if (search) {
        const ragResults = await semanticUniversitySearch(search, user, 20);
        const universityIds = ragResults.map(r => r.id);
        const fetchedUniversities = await prisma.university.findMany({
          where: { id: { in: universityIds } },
        });
        universities = universityIds
          .map(id => fetchedUniversities.find(u => u.id === id))
          .filter(Boolean) as any[];

        if (universities.length === 0) {
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
          .filter(Boolean) as any[];

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

      const localUniversities = await prisma.university.findMany({
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

      let externalUniversities: any[] = [];
      if (search || country) {
        externalUniversities = await fetchExternalUniversities(search || undefined, country || undefined);
      }

      const seenNames = new Set(localUniversities.map(u => u.name.toLowerCase()));
      const uniqueExternal = externalUniversities.filter(u => !seenNames.has(u.name.toLowerCase()));
      universities = [...localUniversities, ...uniqueExternal].slice(0, 80);
    }

    if (user) {
      universities = universities.map(uni => {
        const matchScore = calculateMatchScore(user, uni);
        const category = getMatchCategory(matchScore);
        const labels = [...(uni.tags || [])];
        labels.push(category);
        return {
          ...uni,
          matchScore,
          tags: Array.from(new Set(labels))
        };
      });
      universities.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    if (!search && universities.length > 0) {
      try { await cacheUniversities(cacheKey, universities); } catch (e) { }
    }

    return NextResponse.json(universities);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// POST should be protected (Admin only or disabled)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // In a real app, we'd check if session.user is an admin
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const university = await prisma.university.create({ data: body });
    return NextResponse.json(university);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 });
  }
}

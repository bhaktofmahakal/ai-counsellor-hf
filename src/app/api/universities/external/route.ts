import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const HIPOLABS_API = 'http://universities.hipolabs.com/search';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(e => {
      console.error('Session retrieval failed:', e);
      return null;
    });

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const name = searchParams.get('name');

    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (name) params.append('name', name);

    const response = await fetch(`${HIPOLABS_API}?${params.toString()}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error(`Hipolabs API returned ${response.status}: ${response.statusText}`);
      throw new Error(`Hipolabs API error: ${response.status}`);
    }

    let universities;
    try {
      universities = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse Hipolabs response as JSON:', jsonError);
      throw new Error('Invalid response format from Hipolabs API');
    }

    if (!Array.isArray(universities)) {
      console.error('Hipolabs API returned non-array response');
      return NextResponse.json([]);
    }

    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

    const formatted = universities.slice(0, 50).map((uni: any) => {
      if (!uni.name || !uni.country) {
        console.warn('Skipping university with missing name or country:', uni);
        return null;
      }

      return {
        id: `ext-${sanitize(uni.name)}-${sanitize(uni.country)}`,
        name: uni.name,
        location: uni['state-province'] || uni.country,
        country: uni.country,
        rank: null,
        tuition: 0,
        acceptanceRate: 'N/A',
        matchScore: 0,
        tags: ['External'],
        programs: [],
        description: `University located in ${uni.country}`,
        risks: [],
        strengths: [],
        website: uni.web_pages?.[0] || '',
        domain: uni.domains?.[0] || '',
      };
    }).filter(Boolean);

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching external universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external universities' },
      { status: 500 }
    );
  }
}

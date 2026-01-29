import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const HIPOLABS_API = 'http://universities.hipolabs.com/search';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const name = searchParams.get('name');

    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (name) params.append('name', name);

    const response = await fetch(`${HIPOLABS_API}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Hipolabs API');
    }

    const universities = await response.json();

    const formatted = universities.slice(0, 50).map((uni: any) => ({
      id: `ext_${uni.name.replace(/\s+/g, '_')}`,
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
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching external universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external universities' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { indexUniversity } from '@/lib/embeddings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const HIPOLABS_API = 'http://universities.hipolabs.com/search';

const TARGET_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Netherlands',
  'Singapore',
  'Switzerland',
];

const UNIVERSITY_RANKINGS: Record<string, number> = {
  'Massachusetts Institute of Technology': 1,
  'Stanford University': 3,
  'Harvard University': 4,
  'University of Cambridge': 2,
  'University of Oxford': 5,
  'Imperial College London': 6,
  'ETH Zurich': 7,
  'National University of Singapore': 8,
  'University of California, Berkeley': 10,
  'University of Toronto': 21,
};

const TUITION_ESTIMATES: Record<string, number> = {
  'United States': 55000,
  'United Kingdom': 45000,
  'Canada': 35000,
  'Australia': 32000,
  'Germany': 0,
  'Netherlands': 18000,
  'Singapore': 30000,
  'Switzerland': 1500,
};

const ACCEPTANCE_RATES: Record<string, string> = {
  'top-tier': '5%',
  'competitive': '15%',
  'moderate': '35%',
  'accessible': '60%',
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    let totalSynced = 0;
    let totalEmbedded = 0;

    for (const country of TARGET_COUNTRIES) {
      const response = await fetch(`${HIPOLABS_API}?country=${encodeURIComponent(country)}`);
      const universities = await response.json();

      const limited = universities.slice(0, 30);

      for (const uni of limited) {
        const existingUni = await prisma.university.findFirst({
          where: { domain: uni.domains?.[0] },
        });

        if (existingUni) continue;

        const rank = UNIVERSITY_RANKINGS[uni.name] || null;
        const tuition = TUITION_ESTIMATES[country] || 25000;
        const acceptanceRate = rank
          ? (rank <= 10 ? ACCEPTANCE_RATES['top-tier'] : ACCEPTANCE_RATES['competitive'])
          : ACCEPTANCE_RATES['moderate'];

        const category = rank
          ? (rank <= 10 ? 'Dream' : rank <= 50 ? 'Target' : 'Safe')
          : 'Target';

        const programs = inferPrograms(uni.name, country);
        const description = generateDescription(uni.name, country, rank);
        const { risks, strengths } = generateRisksStrengths(country, tuition, rank);

        const createdUni = await prisma.university.create({
          data: {
            name: uni.name,
            location: uni['state-province'] || country,
            country: country,
            rank: rank,
            tuition: tuition,
            acceptanceRate: acceptanceRate,
            matchScore: 0,
            tags: [category, country === 'Germany' || country === 'Norway' ? 'No Tuition' : 'Paid'],
            programs: programs,
            description: description,
            risks: risks,
            strengths: strengths,
            website: uni.web_pages?.[0] || '',
            domain: uni.domains?.[0] || '',
          },
        });

        try {
          await indexUniversity({
            id: createdUni.id,
            name: createdUni.name,
            country: createdUni.country,
            location: createdUni.location || '',
            rank: createdUni.rank,
            tuition: createdUni.tuition,
            acceptanceRate: createdUni.acceptanceRate || '',
            programs: createdUni.programs,
            description: createdUni.description || '',
            risks: createdUni.risks,
            strengths: createdUni.strengths,
            tags: createdUni.tags,
          });
          totalEmbedded++;
        } catch (embedError) {
          console.error(`Failed to embed ${createdUni.name}:`, embedError);
        }

        totalSynced++;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      synced: totalSynced,
      embedded: totalEmbedded,
      message: `Synced ${totalSynced} universities, generated ${totalEmbedded} embeddings`,
    });
  } catch (error) {
    console.error('Error syncing universities:', error);
    return NextResponse.json(
      { error: 'Failed to sync universities', details: String(error) },
      { status: 500 }
    );
  }
}

function inferPrograms(name: string, country: string): string[] {
  const base = ['Computer Science', 'Engineering', 'Business', 'Data Science'];

  if (name.includes('Technology') || name.includes('Tech')) {
    return ['Computer Science', 'Engineering', 'AI/ML', 'Robotics'];
  }
  if (name.includes('Medical') || name.includes('Medicine')) {
    return ['Medicine', 'Biomedical Sciences', 'Nursing', 'Pharmacy'];
  }
  if (name.includes('Arts') || name.includes('Humanities')) {
    return ['Liberal Arts', 'Social Sciences', 'Psychology', 'Literature'];
  }

  return base;
}

function generateDescription(name: string, country: string, rank: number | null): string {
  if (rank && rank <= 10) {
    return `${name} is a world-leading research university ranked #${rank} globally. Known for cutting-edge research, exceptional faculty, and competitive programs across all disciplines.`;
  }
  if (rank && rank <= 50) {
    return `${name} is a prestigious institution ranked #${rank} globally, offering high-quality education and strong research programs in ${country}.`;
  }
  return `${name} is a well-regarded university in ${country}, offering diverse academic programs with good faculty and facilities.`;
}

function generateRisksStrengths(country: string, tuition: number, rank: number | null): { risks: string[]; strengths: string[] } {
  const risks: string[] = [];
  const strengths: string[] = [];

  if (tuition > 50000) {
    risks.push('High tuition fees');
  }
  if (country === 'United States') {
    risks.push('Complex visa process (F-1)');
    strengths.push('OPT work authorization (3 years for STEM)');
  }
  if (country === 'Germany') {
    risks.push('German language required for many programs');
    strengths.push('No tuition fees for public universities');
  }
  if (rank && rank <= 10) {
    risks.push('Extremely competitive admissions');
    strengths.push('World-class faculty and research facilities');
  }
  if (country === 'Canada' || country === 'Australia') {
    strengths.push('Post-study work visa available');
  }

  strengths.push('Strong international community');

  return { risks, strengths };
}

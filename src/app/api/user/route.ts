import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedUserTasks } from '@/lib/seedUserTasks';
import { recalculateUniversityMatches } from '@/lib/calculateMatchScore';
import { getServerSession } from 'next-auth';
import { syncStageTasks } from '@/lib/stageTasks';
import bcrypt from 'bcryptjs';

import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (email && email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const activeEmail = email || session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: activeEmail },
      include: {
        shortlists: {
          include: {
            university: true,
          },
        },
        tasks: true,
      },
    }) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || 'Student',
        password: hashedPassword,
        onboardingCompleted: false,
        currentStage: 1,
      } as any,
    }) as any;

    await seedUserTasks(user.id);
    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, universityData, ...updateData } = body;

    if (email && email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let cleanedData = { ...updateData };
    if (password) {
      cleanedData.password = await bcrypt.hash(password, 10);
    }

    // Materialize university if it's external and data is provided
    if (cleanedData.lockedUniversityId && cleanedData.lockedUniversityId.startsWith('ext-') && universityData) {
      try {
        const exists = await prisma.university.findUnique({ where: { id: cleanedData.lockedUniversityId } });
        if (!exists) {
          const { id, matchScore, ...cleanUniData } = universityData;
          await prisma.university.create({
            data: {
              ...cleanUniData,
              id: cleanedData.lockedUniversityId
            }
          });
        }
      } catch (e) {
        console.error('Failed to materialize university on lock:', e);
      }
    }

    // Ensure preferredCountries is an array if present
    if (cleanedData.preferredCountries) {
      if (typeof cleanedData.preferredCountries === 'string') {
        cleanedData.preferredCountries = cleanedData.preferredCountries.split(',').map((c: string) => c.trim());
      } else if (!Array.isArray(cleanedData.preferredCountries)) {
        cleanedData.preferredCountries = [cleanedData.preferredCountries];
      }
    }

    // Sanitize numeric fields
    if (cleanedData.budgetMax) cleanedData.budgetMax = parseInt(cleanedData.budgetMax) || 0;
    if (cleanedData.budgetMin) cleanedData.budgetMin = parseInt(cleanedData.budgetMin) || 0;
    if (cleanedData.currentStage) cleanedData.currentStage = parseInt(cleanedData.currentStage) || 1;

    // Use upsert instead of update to be more resilient (e.g. if record was somehow deleted or not created)
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: cleanedData as any,
      create: {
        email: session.user.email,
        name: session.user.name || 'Student',
        ...cleanedData,
      } as any,
    }) as any;

    if (user.id) {
      await recalculateUniversityMatches(user.id);

      // AUTO-SHORTLIST on LOCK
      if (cleanedData.lockedUniversityId) {
        const existingShortlist = await prisma.shortlist.findUnique({
          where: { userId_universityId: { userId: user.id, universityId: cleanedData.lockedUniversityId } }
        });
        if (!existingShortlist) {
          await prisma.shortlist.create({
            data: { userId: user.id, universityId: cleanedData.lockedUniversityId }
          }).catch(err => console.error('Auto-shortlist failed:', err));
        }
      }

      // Sync tasks if stage changed
      if (cleanedData.currentStage || cleanedData.lockedUniversityId) {
        await syncStageTasks(user.id, user.currentStage);
      }
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.error('❌ [API/User] PATCH Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update user', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (email && email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedUserTasks } from '@/lib/seedUserTasks';
import { recalculateUniversityMatches } from '@/lib/calculateMatchScore';
import { redis } from '@/lib/upstash';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        shortlists: {
          include: {
            university: true,
          },
        },
        tasks: true,
      },
    });

    if (!user) {
      console.error(`❌ [API/User] User not found: ${email}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`✅ [API/User] Fetched user: ${user.id}`);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('❌ [API/User] Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { email: body.email },
        data: body,
      });
      console.log(`✅ [API/User] Updated user: ${user.id}`);
    } else {
      user = await prisma.user.create({
        data: body,
      });

      await seedUserTasks(user.id);
      console.log(`✅ [API/User] Created user: ${user.id}`);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ [API/User] Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 [API/User] Upserting user: ${email}`);

    // Clean updateData - remove null/undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== null && v !== undefined)
    );

    const user = await prisma.user.upsert({
      where: { email },
      update: cleanedData,
      create: {
        email,
        name: cleanedData.name || 'Student',
        onboardingCompleted: cleanedData.onboardingCompleted ?? false,
        currentStage: cleanedData.currentStage || 1,
        ...cleanedData,
      },
    });

    console.log(`✅ [API/User] User upserted: ${user.id}`);

    // If a university was just locked, generate/update stage 4 tasks
    if (updateData.lockedUniversityId) {
      const university = await prisma.university.findUnique({
        where: { id: updateData.lockedUniversityId }
      });

      if (university) {
        console.log(`🎯 [API/User] Generating specific tasks for: ${university.name}`);

        // Update existing stage 4 tasks to be university-specific
        const stage4Tasks = await prisma.task.findMany({
          where: { userId: user.id, stage: 4 }
        });

        for (const task of stage4Tasks) {
          let newTitle = task.title;
          if (!newTitle.includes(university.name)) {
            if (newTitle.includes('SOP')) newTitle = `Draft SOP for ${university.name}`;
            else if (newTitle.includes('Recommendations')) newTitle = `Request LoRs for ${university.name}`;
            else if (newTitle.includes('Essay Prompt')) newTitle = `Review ${university.name} Essay Prompt`;
            else if (newTitle.includes('Financial')) newTitle = `Financial Affidavit for ${university.name}`;

            await prisma.task.update({
              where: { id: task.id },
              data: { title: newTitle }
            });
          }
        }
      }
    }

    if (user.id) {
      await recalculateUniversityMatches(user.id);
      console.log(`✅ [API/User] Recalculated match scores for: ${user.id}`);

      // Invalidate university caches for this user
      try {
        const keys = await redis.keys(`${email}:*`);
        if (keys.length > 0) {
          await redis.del(...keys);
          console.log(`🧹 [API/User] Cleared ${keys.length} university cache keys for ${email}`);
        }
      } catch (e) {
        console.warn('⚠️ [API/User] Failed to clear university cache:', e);
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ [API/User] Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { email },
    });

    console.log(`✅ [API/User] Deleted user: ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ [API/User] Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

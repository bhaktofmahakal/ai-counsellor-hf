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
    const { email, password, ...updateData } = body;

    if (email && email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let cleanedData = { ...updateData };
    if (password) {
      cleanedData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: cleanedData as any,
    }) as any;

    if (user.id) {
      await recalculateUniversityMatches(user.id);
      // Sync tasks if stage changed
      if (cleanedData.currentStage || cleanedData.lockedUniversityId) {
        await syncStageTasks(user.id, user.currentStage);
      }
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
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

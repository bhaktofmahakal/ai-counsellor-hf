import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncStageTasks } from '@/lib/stageTasks';

async function verifyUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  return user?.id === userId;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    if (!(await verifyUser(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Sync tasks to current stage and cleanup invalid phases
    if (user) {
      await syncStageTasks(user.id, user.currentStage);
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [{ stage: 'asc' }, { createdAt: 'asc' }],
    });

    // GAP FIX: Backend Gating for Stage 4
    const filteredTasks = tasks.filter(task => {
      if (task.stage === 4 && !user?.lockedUniversityId) return false;
      return true;
    });

    return NextResponse.json(filteredTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { title, description, priority, stage, due, completed } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    // Force the task to belong to the authenticated user
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        stage: stage || 1,
        due,
        completed: completed || false,
        userId: user.id
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const { id, title, description, priority, stage, due, completed } = await request.json();

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    // Verify task ownership
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare whitelisted update data
    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (priority !== undefined) updatePayload.priority = priority;
    if (stage !== undefined) updatePayload.stage = stage;
    if (due !== undefined) updatePayload.due = due;
    if (completed !== undefined) updatePayload.completed = completed;

    const task = await prisma.task.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const { id } = await request.json();

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    // Verify task ownership
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

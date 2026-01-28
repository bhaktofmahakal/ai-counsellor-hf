import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [
        { stage: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    console.log(`✅ [API/Tasks] Fetched ${tasks.length} tasks for user: ${userId}`);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('❌ [API/Tasks] Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: body,
    });

    console.log(`✅ [API/Tasks] Created task: ${task.id} for user: ${task.userId}`);
    return NextResponse.json(task);
  } catch (error) {
    console.error('❌ [API/Tasks] Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ [API/Tasks] Updated task: ${task.id}`);
    return NextResponse.json(task);
  } catch (error) {
    console.error('❌ [API/Tasks] Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

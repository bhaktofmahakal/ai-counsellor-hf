import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SHORTLIST_TASKS = [
  {
    title: 'Research {university} admission requirements',
    priority: 'high',
    stage: 3,
  },
  {
    title: 'Check {university} application deadlines',
    priority: 'high',
    stage: 3,
  },
  {
    title: 'Prepare Statement of Purpose for {university}',
    priority: 'medium',
    stage: 3,
  },
  {
    title: 'Request transcripts for {university} application',
    priority: 'medium',
    stage: 3,
  },
  {
    title: 'Gather recommendation letters for {university}',
    priority: 'medium',
    stage: 3,
  },
];

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

    const shortlists = await prisma.shortlist.findMany({
      where: { userId },
      include: {
        university: true,
      },
    });

    console.log(`✅ [API/Shortlist] Fetched ${shortlists.length} shortlists for user: ${userId}`);
    return NextResponse.json(shortlists);
  } catch (error) {
    console.error('❌ [API/Shortlist] Error fetching shortlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shortlists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, universityId, ...updateData } = await request.json();

    if (!userId || !universityId) {
      return NextResponse.json(
        { error: 'User ID and University ID are required' },
        { status: 400 }
      );
    }

    console.log(`🔄 [API/Shortlist] Toggling shortlist for user ${userId}, university ${universityId}`);

    const existing = await prisma.shortlist.findUnique({
      where: {
        userId_universityId: {
          userId,
          universityId,
        },
      },
      include: {
        university: true,
      },
    });

    if (existing) {
      await prisma.shortlist.delete({
        where: { id: existing.id },
      });

      const uniName = existing.university?.name || '';
      await prisma.task.deleteMany({
        where: {
          userId,
          title: {
            contains: uniName,
          },
        },
      });

      console.log(`✅ [API/Shortlist] Removed shortlist and tasks for: ${uniName}`);
      return NextResponse.json({ action: 'removed', shortlist: existing });
    } else {
      let university = await prisma.university.findUnique({
        where: { id: universityId },
      });

      // If university doesn't exist (e.g. it was an external search result)
      // and we have the data, materialise it first
      if (!university && universityId.startsWith('ext-') && updateData.universityData) {
        console.log(`🏗️ [API/Shortlist] Materialising external university: ${updateData.universityData.name}`);
        const { id, matchScore, ...cleanData } = updateData.universityData;

        university = await prisma.university.create({
          data: {
            ...cleanData,
            // Generate a permanent CUID instead of the ext- ID if desired, 
            // but keeping the ext- ID as the primary key works too if we're careful.
          }
        });
      }

      if (!university) {
        return NextResponse.json(
          { error: 'University not found. Please try again.' },
          { status: 404 }
        );
      }

      const shortlist = await prisma.shortlist.create({
        data: {
          userId,
          universityId: university.id,
        },
        include: {
          university: true,
        },
      });

      const tasksToCreate = SHORTLIST_TASKS.map(task => ({
        userId,
        title: task.title.replace('{university}', university.name),
        priority: task.priority,
        stage: task.stage,
        completed: false,
      }));

      await prisma.task.createMany({
        data: tasksToCreate,
      });

      // Advance user stage to 3 (Finalizing) if they are currently in stage 2
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.currentStage <= 2) {
        await prisma.user.update({
          where: { id: userId },
          data: { currentStage: 3 }
        });
        console.log(`📈 [API/Shortlist] User ${userId} advanced to Stage 3`);
      }

      console.log(`✅ [API/Shortlist] Added shortlist for ${university.name}, created ${tasksToCreate.length} tasks`);

      return NextResponse.json({
        action: 'added',
        shortlist,
        tasksCreated: tasksToCreate.length,
        newStage: user && user.currentStage <= 2 ? 3 : undefined
      });
    }
  } catch (error) {
    console.error('❌ [API/Shortlist] Error toggling shortlist:', error);
    return NextResponse.json(
      { error: 'Failed to update shortlist' },
      { status: 500 }
    );
  }
}

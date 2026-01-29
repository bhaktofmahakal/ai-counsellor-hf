import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncStageTasks } from '@/lib/stageTasks';

const SHORTLIST_TASKS = [
  { title: 'Research {university} admission requirements', priority: 'high', stage: 3, daysOffset: 3 },
  { title: 'Check {university} application deadlines', priority: 'high', stage: 3, daysOffset: 5 },
  { title: 'Prepare Statement of Purpose for {university}', priority: 'medium', stage: 3, daysOffset: 20 },
  { title: 'Request transcripts for {university} application', priority: 'medium', stage: 3, daysOffset: 15 },
  { title: 'Gather recommendation letters for {university}', priority: 'medium', stage: 3, daysOffset: 25 },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const shortlists = await prisma.shortlist.findMany({
      where: { userId: user.id },
      include: { university: true },
    });

    return NextResponse.json(shortlists);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shortlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { universityId, ...updateData } = await request.json();
    if (!universityId) return NextResponse.json({ error: 'University ID is required' }, { status: 400 });

    const existing = await prisma.shortlist.findUnique({
      where: { userId_universityId: { userId: user.id, universityId } },
      include: { university: true },
    });

    if (existing) {
      await prisma.shortlist.delete({ where: { id: existing.id } });
      const uniName = existing.university?.name || '';
      await prisma.task.deleteMany({
        where: { userId: user.id, title: { contains: uniName } },
      });
      return NextResponse.json({ action: 'removed', shortlist: existing });
    } else {
      let university = await prisma.university.findUnique({ where: { id: universityId } });

      // Handle external university materialization
      if (!university && universityId.startsWith('ext-') && updateData.universityData) {
        const { id, matchScore, ...cleanData } = updateData.universityData;
        university = await prisma.university.create({ data: cleanData });
      }

      if (!university) return NextResponse.json({ error: 'University not found' }, { status: 404 });

      const shortlist = await prisma.shortlist.create({
        data: { userId: user.id, universityId: university.id },
        include: { university: true },
      });

      const tasksToCreate = SHORTLIST_TASKS.map(task => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (task.daysOffset || 7));
        return {
          userId: user.id,
          title: task.title.replace('{university}', university.name),
          priority: task.priority,
          stage: task.stage,
          completed: false,
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
      });

      await prisma.task.createMany({ data: tasksToCreate });

      let newStage = user.currentStage;
      if (user.currentStage <= 2) {
        await prisma.user.update({ where: { id: user.id }, data: { currentStage: 3 } });
        newStage = 3;
        await syncStageTasks(user.id, 3);
      }

      return NextResponse.json({ action: 'added', shortlist, tasksCreated: tasksToCreate.length, newStage });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shortlist' }, { status: 500 });
  }
}

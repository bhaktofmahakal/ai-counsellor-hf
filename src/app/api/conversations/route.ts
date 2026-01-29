import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const listSessions = searchParams.get('listSessions') === 'true';

    if (listSessions) {
      const allMessages = await prisma.conversation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      const seenSessions = new Set();
      const sessions = allMessages.filter(m => {
        const sid = m.sessionId || 'default';
        if (seenSessions.has(sid)) return false;
        seenSessions.add(sid);
        return true;
      });

      return NextResponse.json(sessions);
    }

    const where: any = { userId: user.id };
    where.sessionId = sessionId || "default";

    const history = await prisma.conversation.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { role, content, sessionId, title } = await request.json();

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
    }

    const message = await prisma.conversation.create({
      data: {
        userId: user.id,
        role,
        content,
        sessionId: sessionId || "default",
        title: title || undefined,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await prisma.conversation.deleteMany({
      where: {
        userId: user.id,
        sessionId: sessionId
      }
    });

    return NextResponse.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}

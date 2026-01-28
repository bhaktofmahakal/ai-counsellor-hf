import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const listSessions = searchParams.get('listSessions') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (listSessions) {
      console.log(`🔍 [API/Conversations] Listing sessions for user: ${userId}`);
      try {
        const allMessages = await prisma.conversation.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        // Manually get distinct sessions in JS for better compatibility
        const seenSessions = new Set();
        const sessions = allMessages.filter(m => {
          const sid = (m as any).sessionId || 'default';
          if (seenSessions.has(sid)) return false;
          seenSessions.add(sid);
          return true;
        }).map(m => ({
          ...m,
          sessionId: (m as any).sessionId || 'default'
        }));

        return NextResponse.json(sessions);
      } catch (e: any) {
        console.error(`❌ [API/Conversations] Error listing sessions:`, e.message);
        // Fallback: just return all messages if distinct fails
        const all = await prisma.conversation.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 50
        });
        return NextResponse.json(all.map(m => ({
          ...m,
          sessionId: (m as any).sessionId || 'default'
        })));
      }
    }

    const where: any = { userId };
    if (sessionId) {
      where.sessionId = sessionId;
    } else {
      where.sessionId = "default";
    }

    console.log(`🔍 [API/Conversations] Fetching messages for session: ${where.sessionId}`);
    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('❌ [API/Conversations] CRITICAL ERROR:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch conversation history', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, role, content, sessionId, title } = await request.json();

    if (!userId || !role || !content) {
      return NextResponse.json(
        { error: 'User ID, role, and content are required' },
        { status: 400 }
      );
    }

    const message = await (prisma.conversation as any).create({
      data: {
        userId,
        role,
        content,
        sessionId: sessionId || "default",
        title: title || undefined,
      },
    });

    console.log(`✅ [API/Conversations] Saved ${role} message for user: ${userId} in session: ${sessionId || 'default'}`);
    return NextResponse.json(message);
  } catch (error) {
    console.error('❌ [API/Conversations] Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

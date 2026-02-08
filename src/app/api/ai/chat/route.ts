import { NextRequest, NextResponse } from 'next/server';
import { streamAIResponse } from '@/lib/groq';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read the body as text first to avoid JSON parse errors on empty bodies
    const bodyText = await request.text();
    if (!bodyText) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      console.error('Failed to parse AI chat request JSON');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { message, userProfile, currentStage, conversationHistory, persona } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const stream = await streamAIResponse(
      message,
      userProfile || {},
      conversationHistory || [],
      currentStage || 1,
      persona || 'standard'
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

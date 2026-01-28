import { NextRequest, NextResponse } from 'next/server';
import { streamOnboardingResponse } from '@/lib/groq';

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const stream = await streamOnboardingResponse(
            message,
            conversationHistory || []
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
        console.error('Error in AI onboarding:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI onboarding response' },
            { status: 500 }
        );
    }
}

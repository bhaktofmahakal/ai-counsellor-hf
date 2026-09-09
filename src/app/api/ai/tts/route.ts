import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George - As requested

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ELEVENLABS_API_KEY) {
        console.error('❌ [TTS] API Key is missing in env');
        return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    console.log(`✅ [TTS] Using API Key starting with: ${ELEVENLABS_API_KEY.substring(0, 5)}...`);

    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const client = new ElevenLabsClient({
            apiKey: ELEVENLABS_API_KEY,
        });

        // Attempting with camelCase as per user snippet (though SDK usually wants snake_case)
        const audioStream = await client.textToSpeech.convert(VOICE_ID, {
            text: text,
            modelId: 'eleven_multilingual_v2',
            outputFormat: 'mp3_44100_128', // Trying camelCase to match user snippet
        } as any);

        // Convert the stream/readable to a buffer
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return new Response(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error('❌ [TTS API] Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to generate speech' },
            { status: 500 }
        );
    }
}

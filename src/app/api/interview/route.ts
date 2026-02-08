
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { groq } from '@/lib/groq';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages, universityName } = await req.json();

        const systemPrompt = `You are an experienced University Admissions Interviewer representing ${universityName}.
    
    Your Goal: Conduct a professional yet encouraging mock interview for a prospective student.
    
    Rules:
    1. Ask ONE question at a time.
    2. Start by introducing yourself and asking a standard opening question (e.g., "Tell me about yourself").
    3. Dig deeper into their answers (follow-up questions).
    4. Focus on academic goals, leadership, and why they chose ${universityName}.
    5. Keep your responses concise (under 100 words) to keep the conversation flowing.
    6. Be polite but professional.
    
    Current University Context: ${universityName}
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 300,
        });

        return NextResponse.json({
            message: completion.choices[0]?.message?.content || "I'm sorry, I could not generate a response."
        });
    } catch (error) {
        console.error('Interview API Error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}

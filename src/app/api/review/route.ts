
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

        const { content, type, universityName } = await req.json();

        const systemPrompt = `You are a strict but helpful Ivy League Admissions Essay Coach.
    
    Task: Review the following ${type} for ${universityName}.
    
    Output Format: return ONLY a valid JSON object with these keys:
    {
      "score": number (0-100),
      "verdict": string ("Strong Accept", "Accept", "Waitlist", "Reject"),
      "feedback": string (A detailed paragraph on strengths and weaknesses),
      "improvements": string[] (List of 3 specific actionable improvements)
    }
    
    Do not include any markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is my essay:\n\n${content}` }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2, // Lower temperature for consistent JSON
            response_format: { type: 'json_object' },
            max_tokens: 1000,
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
            throw new Error("Empty response from AI");
        }

        const result = JSON.parse(responseContent);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Content Review API Error:', error);
        return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
    }
}

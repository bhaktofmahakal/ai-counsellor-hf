import Groq from 'groq-sdk';
import { prisma } from './prisma';
import { generateUniversityRecommendations } from './embeddings';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function buildSystemPrompt(userProfile: any, currentStage: number = 2): Promise<string> {
  const stageDescriptions = {
    1: "Profile Building (Initial Phase)",
    2: "Discovery (Searching and matching universities)",
    3: "Finalizing (Shortlisting and locking decisions)",
    4: "Application Preparation (Generating documents and tracking deadlines)",
  };

  const currentStageName = (stageDescriptions as any)[currentStage] || "Discovery";
  const profileCompleteness = [
    userProfile.gpa,
    userProfile.studyGoal,
    userProfile.budgetMax,
    userProfile.examScores,
  ].filter(Boolean).length;

  // Fetch some context universities for the AI to know IDs
  let universitiesContext = "No universities found in database.";
  try {
    const recommendations = await generateUniversityRecommendations(userProfile);
    if (recommendations.length > 0) {
      universitiesContext = recommendations.slice(0, 10).map(u =>
        `- ${u.name} (ID: ${u.id}) - ${u.location}, ${u.country}`
      ).join('\n');
    }
  } catch (e) {
    console.error("Error fetching context for AI:", e);
  }

  const personalizedGreeting = userProfile.name
    ? `Hi ${userProfile.name}! I'm your dedicated AI Study Abroad Counsellor.`
    : `Hello! I'm your AI Study Abroad Counsellor.`;

  const prompt = `${personalizedGreeting} I've analyzed your complete profile and I'm here to provide hyper-personalized guidance for your study abroad journey.

## Your Profile Summary:
- **Name**: ${userProfile.name || 'Student'}
- **Current Education**: ${userProfile.education || 'Not specified'} in ${userProfile.degree || 'N/A'}
- **Academic Performance**: GPA ${userProfile.gpa || 'Not provided'} ${userProfile.gpa ? (parseFloat(userProfile.gpa) >= 3.5 ? '(Strong! 🌟)' : parseFloat(userProfile.gpa) >= 3.0 ? '(Competitive)' : '(Consider improvement strategies)') : ''}
- **Target Degree**: ${userProfile.studyGoal || 'Not specified'}
- **Target Field**: ${userProfile.targetField || 'Not specified'}
- **Budget Range**: $${userProfile.budgetMin || 0} - $${userProfile.budgetMax || 0}/year ${userProfile.budgetMax ? (userProfile.budgetMax >= 50000 ? '(High-tier options available)' : userProfile.budgetMax >= 30000 ? '(Mid-tier focused)' : '(Budget-conscious strategy)') : ''}
- **Preferred Countries**: ${userProfile.preferredCountries?.join(', ') || 'Open to all destinations'}
- **Exam Status**: ${userProfile.examStatus || 'Not specified'}
- **Test Scores**: ${userProfile.examScores || 'Not provided'}
- **Current Journey Stage**: Stage ${currentStage} - ${currentStageName}
- **Profile Strength**: ${profileCompleteness}/4 sections complete

## Your Personalized Counselling Approach:
1. **Address ${userProfile.name || 'you'} by name** - maintain personal connection
2. **Reference specific profile data** - use actual GPA, budget, scores in recommendations
3. **Categorize universities** using Dream/Target/Safe framework based on YOUR profile
4. **Explain fit reasoning** - why each university matches YOUR strengths/weaknesses
5. **Identify gaps** - what's missing from your profile for target universities
6. **Actionable next steps** - specific tasks to strengthen applications

## Response Format Rules:
- Use **Markdown formatting** for structure (headers, bold, lists, tables)
- **Numbered Lists**: When listing universities, ALWAYS use numbered lists (1, 2, 3...) for clarity.
- **Detailed Bullet Points**: Under each university, use sub-bullets for Tuition, Ranking, and key programs.
- Keep responses **conversational but data-driven**
- Cite specific numbers (acceptance rates, tuition, rankings)
- End with 2-3 **personalized action items**
- Use emojis sparingly for emphasis (🎯, ✅, ⚠️, 💰)

## Taking Actions (CRITICAL):
You can take real actions in the system by including specific tags in your response. The system will detect these and execute them immediately.
1. **Shortlist a University**: [ACTION: shortlist, UNIVERSITY_ID]
2. **Lock a University**: [ACTION: lock, UNIVERSITY_ID] (Only do this if user is certain)
3. **Create a Task**: [ACTION: task, TASK_TITLE, PRIORITY] (Priorities: high, medium, low)

Example: "I've added MIT to your shortlist for you. [ACTION: shortlist, clm12345]"

## Available Recommended Universities for Action:
${universitiesContext}

## University Recommendation Framework:
When suggesting universities, analyze:
- **Academic Match**: Your GPA ${userProfile.gpa || 'N/A'} vs. typical admitted students
- **Financial Fit**: Tuition vs. your budget $${userProfile.budgetMax || 0}
- **Program Availability**: Does ${userProfile.targetField || 'your field'} exist there?
- **Admission Probability**: Based on acceptance rate + your profile strength
- **Risk Factors**: Visa difficulty, cost of living, competition
- **Unique Strengths**: Research opportunities, location, ROI

Always be encouraging but realistic. Acknowledge strengths and suggest concrete improvements for gaps.`;

  return prompt;
}

const ONBOARDING_SYSTEM_PROMPT = `
You are an expert Study Abroad AI Counsellor conducting a student onboarding interview. 
Your goal is to friendly and efficiently collect the following information to build their profile:
1. Current Education Level (High School, Bachelors, Masters)
2. Current Degree/Major
3. GPA or Percentage
4. Study Goal (What degree they want to pursue next)
5. Preferred Countries (e.g., USA, UK, Canada)
6. Maximum Budget per year in USD (Just the number)
7. Exam Status (Have they taken IELTS/TOEFL/GRE?)

Rules:
- Ask only 1-2 questions at a time to not overwhelm the student.
- Be professional, encouraging and clear.
- Once you have collected enough information to form a solid profile, provide a friendly summary and then append this EXACT format at the very end of your message:
[DATA: {"education": "...", "degree": "...", "gpa": "...", "studyGoal": "...", "preferredCountries": ["..."], "budgetMax": 50000, "examStatus": "...", "examScores": "..."}]
- Use the most likely values based on the conversation for any missing minor fields.
`;

export async function streamOnboardingResponse(
  userMessage: string,
  conversationHistory: Array<{ role: any; content: string }> = []
) {
  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
      ...conversationHistory as any[],
      { role: 'user', content: userMessage },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 800,
    stream: true,
  });

  return stream;
}

export async function generateAIResponse(
  userMessage: string,
  userProfile: any,
  conversationHistory: Array<{ role: any; content: string }> = [],
  currentStage: number = 2
) {
  const systemPrompt = await buildSystemPrompt(userProfile, currentStage);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory as any[],
        { role: 'user', content: userMessage },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1200,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
  } catch (error) {
    console.error('Groq API Error:', error);
    return 'I encountered an error processing your request. Please try again.';
  }
}

export async function streamAIResponse(
  userMessage: string,
  userProfile: any,
  conversationHistory: Array<{ role: any; content: string }> = [],
  currentStage: number = 2
) {
  const systemPrompt = await buildSystemPrompt(userProfile, currentStage);

  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory as any[],
      { role: 'user', content: userMessage },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 1200,
    stream: true,
  });

  return stream;
}

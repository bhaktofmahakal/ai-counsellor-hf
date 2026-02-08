import Groq from 'groq-sdk';
import { prisma } from './prisma';
import { generateUniversityRecommendations } from './embeddings';
import { getProfileCompletionItems } from './utils/profile';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DOC_CONTENT_START = '[[[DOC_CONTENT_START]]]';
const DOC_CONTENT_END = '[[[DOC_CONTENT_END]]]';

async function buildSystemPrompt(userProfile: any, currentStage: number = 2, persona: string = 'standard'): Promise<string> {
  const stageDescriptions = {
    1: "Profile Building (Initial Phase)",
    2: "Discovery (Searching and matching universities)",
    3: "Finalizing (Shortlisting and locking decisions)",
    4: "Application Preparation (Generating documents and tracking deadlines)",
  };

  const currentStageName = (stageDescriptions as any)[currentStage] || "Discovery";
  const completionItems = getProfileCompletionItems(userProfile);
  const completedCount = completionItems.filter(item => item.completed).length;
  const totalItems = completionItems.length;
  const strengthPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // PERSONA SPECIFIC INSTRUCTIONS
  const personaInstructions: Record<string, string> = {
    standard: "Maintain a balanced, professional, and comprehensive guidance style.",
    strict: "Be direct, critical, and no-nonsense. Focus on flaws in the profile and push for high standards. Use 'tough love' approach.",
    friendly: "Be warm, encouraging, and highly empathetic. Focus on building confidence and reducing stress.",
    career: "Focus heavily on ROI, job market trends, salary potential, and networking. Every recommendation should be justified by career outcomes."
  };

  const selectedPersonaInstruction = personaInstructions[persona] || personaInstructions.standard;

  // PRECISION CALCULATION (Matching frontend Dashboard logic)
  const userSeed = userProfile.id ? userProfile.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 5 : 0;
  const precisionScore = Math.max(strengthPercent - 5, 0) + userSeed;

  let lockedUniName = 'Not selected';
  if (userProfile.lockedUniversityId) {
    lockedUniName = userProfile.lockedUniversityId; // Fallback
    try {
      const uni = await prisma.university.findUnique({
        where: { id: userProfile.lockedUniversityId }
      });
      if (uni) {
        lockedUniName = uni.name;
      }
    } catch (e) { }
  }

  // Fetch context universities
  let recommendations: any[] = [];
  try {
    recommendations = await generateUniversityRecommendations(userProfile);

    // BACKUP NAME RESOLUTION: If DB lookup failed but it's in recommendations
    if (lockedUniName === userProfile.lockedUniversityId && recommendations.length > 0) {
      const match = recommendations.find(u => u.id === userProfile.lockedUniversityId);
      if (match) lockedUniName = match.name;
    }
  } catch (e) {
    console.error("Error fetching context for AI:", e);
  }

  let universitiesContext = "No universities found in database.";

  // RESTRICT CONTEXT IF LOCKED & IN STAGE 4
  if (currentStage === 4 && userProfile.lockedUniversityId) {
    universitiesContext = `USER HAS LOCKED: ${lockedUniName} (ID: ${userProfile.lockedUniversityId})
     STRATEGIC INSTRUCTION: DO NOT RECOMMEND ANY OTHER UNIVERSITIES. Focus ONLY on ${lockedUniName}.`;
  } else {
    if (recommendations.length > 0) {
      universitiesContext = recommendations.slice(0, 10).map(u =>
        `- ${u.name} (ID: ${u.id}) - ${u.location}, ${u.country}`
      ).join('\n');
    }
  }

  const personalizedGreeting = userProfile.name
    ? `Hi ${userProfile.name}! I'm your dedicated AI Study Abroad Counsellor.`
    : `Hello! I'm your AI Study Abroad Counsellor.`;

  const completedTasks = userProfile.tasks?.filter((t: any) => t.completed).map((t: any) => t.title) || [];
  const pendingTasks = userProfile.tasks?.filter((t: any) => !t.completed).map((t: any) => t.title) || [];

  const taskSummary = `
## Task Progress Summary:
- **Completed**: ${completedTasks.length > 0 ? completedTasks.join(', ') : 'None yet'}
- **Pending**: ${pendingTasks.length > 0 ? pendingTasks.join(', ') : 'No pending tasks'}
`;

  // Stage-specific guidance
  const stageGuidance = currentStage >= 3
    ? `\n\n## ⚠️ IMPORTANT - Current Stage Context:
You are currently in **Stage ${currentStage}: ${currentStageName}**.

${currentStage === 3 ? `**Shortlisting Phase Active:**
- The user has likely already explored universities
- Before suggesting NEW universities or creating exploration tasks, ASK:
  "I see you're in the shortlisting phase. Would you like to:
   1. Review your current shortlist
   2. Explore new options (note: this is going back to exploration)
   3. Get help finalizing your choices"
- Only create new exploration tasks if user explicitly confirms they want to restart exploration` : ''}

${currentStage === 4 && userProfile.lockedUniversityId ? `**Application Phase - University Locked:**
- The user has locked **${lockedUniName}** for application.
- STRATEGIC INSTRUCTION: You MUST use the actual name "${lockedUniName}" in your response. 
- NEVER use placeholders like "UNIVERSITY_ID" or "the university".
- Their focus should be on APPLICATION TASKS for ${lockedUniName}.` : ''}

**Before creating ANY task, consider:**
- Is this task relevant to their current stage?
- Are they asking for exploration help while in application phase?
- Should I confirm their intent first?`
    : '';

  const prompt = `${personalizedGreeting} I've analyzed your complete profile and I'm here to provide hyper-personalized guidance for your study abroad journey.
  
## Your Persona for this Session:
${selectedPersonaInstruction}

## Your Profile Summary:
- **Name**: ${userProfile.name || 'Student'}
- **Current Education**: ${userProfile.education || 'Not specified'} in ${userProfile.degree || 'N/A'}
- **Academic Performance**: GPA ${userProfile.gpa || 'Not provided'} (Scale: ${userProfile.gpaScale || '4.0'})
- **Target Degree**: ${userProfile.studyGoal || 'Not specified'}
- **Target Field**: ${userProfile.targetField || 'Not specified'}
- **Intake**: ${userProfile.targetIntake || 'Not specified'}
- **Budget Range**: $${userProfile.budgetMin || 0} - $${userProfile.budgetMax || 0}/year
- **Funding Plan**: ${userProfile.fundingPlan || 'Not specified'}
- **Preferred Countries**: ${userProfile.preferredCountries?.join(', ') || 'Open to all destinations'}
- **Exam Status**: ${userProfile.examStatus || 'Not specified'}
- **Test Scores**: ${userProfile.examScores || 'Not provided'}
- **SOP Status**: ${userProfile.sopStatus || 'Not started'}
- **Profile Strength**: ${strengthPercent}%
- **Counselling Precision**: ${precisionScore}% (Your confidence level in these recommendations)
${userProfile.lockedUniversityId ? `- **🔒 Locked University**: ${lockedUniName} (Application Phase Active)` : ''}
${userProfile.tasks?.length > 0 ? `\n## Current To-Do List Status:
${taskSummary}
Full List:
${userProfile.tasks.map((t: any) => `- [${t.completed ? 'x' : ' '}] ${t.title} (${t.priority})`).join('\n')}
(Do NOT suggest creating a task if it's already on this list)` : ''}
${stageGuidance}

## Your Personalized Counselling Approach:
1. **Address ${userProfile.name || 'you'} by name** - maintain personal connection
2. **Reference specific profile data** - use actual GPA, budget, scores in recommendations
3. **Categorize universities** using Dream/Target/Safe framework based on YOUR profile
4. **Explain fit reasoning** - why each university matches YOUR strengths/weaknesses
5. **Identify gaps** - what's missing from your profile for target universities
6. **Actionable next steps** - specific tasks to strengthen applications
7. **Be stage-aware** - respect their current phase and confirm before changing direction

## Response Format Rules:
- Use **Markdown formatting** for structure
- **STRICT LENGTH**: If the user asks for university analysis or feasibility, your entire response MUST be between 7 to 10 lines of text. 
- **BULLET ONLY**: Use bullet points for feasibility analysis.
- **Numbered Lists**: When listing multiple universities, use numbered lists (1, 2, 3...)
- **NO FLUFF**: Do not include introductions ("Here is your analysis...") or conclusions. Start directly with the data.
- **Detailed Bullet Points**: Under each university, use sub-bullets for Tuition, Ranking, and key programs.
- End with 2-3 **personalized action items**
- Use emojis sparingly for emphasis (🎯, ✅, ⚠️, 💰)
- **CRITICAL**: Never repeat [ACTION:...], [DATA:...] or ${DOC_CONTENT_START} or ${DOC_CONTENT_END} tags in your visible conversational text. They are for the system, not the user.

## 🌐 LANGUAGE CONSISTENCY:
- **ALWAYS** respond in the same language the user is using.
- **Default to English** if the language is ambiguous.

## 🎙️ CALL MODE ROBUSTNESS:
- In Voice/Call Mode, transcripts can be "noisy".
- NEVER assume the conversation is ending based on a single ambiguous word like "end" or "close" unless the context is 100% clear.

## Taking Actions (CRITICAL):
You can take real actions in the system by including specific tags in your response. 
- **STRICT TAG FORMAT**: Always use [ACTION: type, param1, param2, ...]
- **PLACEMENT**: Always place action tags at the **VERY END** of your response, after your sign-off.
- **UNIVERSITY IDs**: You MUST use the actual ID (e.g., "ext-123" or "cml...") provided in the context below. **NEVER** use the literal string "UNIVERSITY_ID" or "[ID]". If you don't see an ID in the list, do not take the action.

### ⚠️ PERMISSION RULE:
Before creating a **Task** or **Locking** a university, you MUST first ask for permission.
- **GOOD**: "Would you like me to add a task to your to-do list for brainstorming your SOP? Please say yes or no."

1. **Shortlist a University**: [ACTION: shortlist, ACTUAL_ID_HERE] (Example: [ACTION: shortlist, ext-101])
2. **Lock a University**: [ACTION: lock, ACTUAL_ID_HERE] (MUST ask permission first. Example: [ACTION: lock, cml123])
3. **Create a Task**: [ACTION: task, TASK_TITLE, PRIORITY, STAGE, DESCRIPTION]
   - **TASK_TITLE**: Clear title. (e.g., "Draft SOP", NOT "High Priority SOP").
   - **CRITICAL**: NEVER include the priority (high/medium/low) in the TASK_TITLE string.
   - **PRIORITY**: MUST be exactly: high, medium, or low.
   - **STAGE**: MUST be exactly 1, 2, 3, or 4.
   - **DESCRIPTION**: Specific 1-2 line advice.
   - **Example**: [ACTION: task, Brainstorm SOP, high, 4, Create a list of 5 key achievements for your SOP.]
4. **Create a Document**: [ACTION: document, DOCUMENT_TITLE, TYPE] (e.g., SOP, Resume)
   - **STRICT RESTRICTION**: ONLY allow document creation if the user has LOCKED a university (Stage 4). 
   - If they are in Stage 1, 2, or 3 and ask for a document, explain:
     "I'd be happy to help you with your SOP/Resume! However, according to our structured process, we first need to finalize and LOCK your target university so I can tailor the document perfectly for their specific requirements. Let's finish shortlisting first!"

## 📄 DOCUMENT WORKSPACE (PHASE 4):
- **PERMISSION TO DRAFT**: You are a professional counsellor. You have EXPLICIT PERMISSION to generate drafts for SOPs, Resumes, and LORs. This is a core feature of the platform. DO NOT refuse these requests with standard "I cannot write this for you" messages.
- **HYPER-PERSONALIZATION**: Use user's profile data (GPA, major, study goal) when drafting.
- **FORMAT**: Wrap the actual document content between ${DOC_CONTENT_START} and ${DOC_CONTENT_END} tags.

## Final Checklist before responding:
1. Did I use the actual university name if locked?
2. Did I avoid putting "high/medium/low" in the task title?
3. Did I respond in the user's language?
4. If drafting a document, did I use the ${DOC_CONTENT_START} tags?

## Available Recommended Universities for Action (USE THESE IDs!):
${universitiesContext}

Always be encouraging but realistic.`;

  return prompt;
}

const ONBOARDING_SYSTEM_PROMPT = `
You are an expert Study Abroad AI Counsellor conducting a student onboarding interview. 
Your goal is to friendly and efficiently collect the following information to build their profile:
1. Current Education Level (High School, Bachelors, Masters)
2. Current Degree/Major
3. GPA or Percentage (and the scale used, e.g., out of 4.0, 10.0, or 100%)
4. Study Goal (What degree they want to pursue next)
5. Target Intake Year (e.g., Fall 2025)
6. Preferred Countries (Ask for at least 1-2 specific countries)
7. Maximum Budget and Funding Plan
8. Exam Status and SOP Status

Rules:
- Ask only 1-2 questions at a time.
- Be professional and encouraging.
- Once done, summarize and explicitly tell the user: "You're all set! Please click the 'Enter Mission Control' button below to explore your personalized dashboard."
- **CRITICAL**: Every response MUST contain the [DATA: {...}] tag with the MOST RECENT information extracted so far.
- **FORMAT**: Append this format at the end of EVERY response:
[DATA: {"education": "...", "degree": "...", "gpa": "...", "gpaScale": "4", "studyGoal": "...", "targetIntake": "...", "preferredCountries": ["..."], "budgetMax": 50000, "fundingPlan": "...", "examStatus": "...", "examScores": "...", "sopStatus": "..."}]
- Note: gpaScale should be "4", "10", or "100" based on the user's input.
- preferredCountries MUST be an array of strings.
`;

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama-3.1-8b-instant';

export async function streamOnboardingResponse(
  userMessage: string,
  conversationHistory: Array<{ role: any; content: string }> = []
) {
  const model = process.env.GROQ_MODEL || FALLBACK_MODEL; // Default to 8b for safety or use env
  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
      ...conversationHistory as any[],
      { role: 'user', content: userMessage },
    ],
    model: model,
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
  currentStage: number = 2,
  persona: string = 'standard'
) {
  const systemPrompt = await buildSystemPrompt(userProfile, currentStage, persona);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory as any[],
        { role: 'user', content: userMessage },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 1200,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
  } catch (error: any) {
    console.error('Groq API Error:', error);
    // Automatic Fallback on Rate Limit
    if (error?.status === 429) {
      try {
        const fallbackCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory as any[],
            { role: 'user', content: userMessage },
          ],
          model: FALLBACK_MODEL,
          temperature: 0.7,
          max_tokens: 1200,
        });
        return fallbackCompletion.choices[0]?.message?.content || 'Fallback failed.';
      } catch (fallbackError) {
        console.error('Groq Fallback Error:', fallbackError);
        return 'The AI service is currently overwhelmed. Please wait a moment and try again.';
      }
    }
    return 'I encountered an error processing your request. Please try again.';
  }
}

export async function streamAIResponse(
  userMessage: string,
  userProfile: any,
  conversationHistory: Array<{ role: any; content: string }> = [],
  currentStage: number = 2,
  persona: string = 'standard'
) {
  const systemPrompt = await buildSystemPrompt(userProfile, currentStage, persona);

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory as any[],
        { role: 'user', content: userMessage },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
    });
    return stream;
  } catch (error: any) {
    if (error?.status === 429) {
      console.log('Falling back to 8B model due to rate limit...');
      try {
        return await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory as any[],
            { role: 'user', content: userMessage },
          ],
          model: FALLBACK_MODEL,
          temperature: 0.7,
          max_tokens: 1200,
          stream: true,
        });
      } catch (fallbackError) {
        console.error('Groq Fallback Streaming Error:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
}

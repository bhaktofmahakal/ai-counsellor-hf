import Groq from 'groq-sdk';
import { prisma } from './prisma';
import { generateUniversityRecommendations } from './embeddings';
import { getProfileCompletionItems } from './utils/profile';

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
  const completionItems = getProfileCompletionItems(userProfile);
  const completedCount = completionItems.filter(item => item.completed).length;
  const totalItems = completionItems.length;
  const strengthPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  let lockedUniName = userProfile.lockedUniversityId || 'Not selected';
  if (userProfile.lockedUniversityId) {
    try {
      const uni = await prisma.university.findUnique({
        where: { id: userProfile.lockedUniversityId }
      });
      if (uni) lockedUniName = uni.name;
    } catch (e) { }
  }

  // Fetch some context universities for the AI to know IDs
  let universitiesContext = "No universities found in database.";

  // RESTRICT CONTEXT IF LOCKED
  if (currentStage === 4 && userProfile.lockedUniversityId) {
    universitiesContext = `USER HAS LOCKED: ${lockedUniName} (ID: ${userProfile.lockedUniversityId})
     STRATEGIC INSTRUCTION: DO NOT RECOMMEND ANY OTHER UNIVERSITIES. Focus ONLY on ${lockedUniName}.`;
  } else {
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
  }

  const personalizedGreeting = userProfile.name
    ? `Hi ${userProfile.name}! I'm your dedicated AI Study Abroad Counsellor.`
    : `Hello! I'm your AI Study Abroad Counsellor.`;

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
- The user has locked **${lockedUniName}** for application
- Their focus should be on APPLICATION TASKS, not discovery, unless they explicitly want to pivot.
- If user asks about NEW universities, briefly mention:
  "I see you've locked ${lockedUniName}, but I'm happy to help you explore other options if you're reconsidering!"
- Focus on: SOP writing, document prep, deadline tracking, application strategy` : ''}

**Before creating ANY task, consider:**
- Is this task relevant to their current stage?
- Are they asking for exploration help while in application phase?
- Should I confirm their intent first?`
    : '';

  const prompt = `${personalizedGreeting} I've analyzed your complete profile and I'm here to provide hyper-personalized guidance for your study abroad journey.

## Your Profile Summary:
- **Name**: ${userProfile.name || 'Student'}
- **Current Education**: ${userProfile.education || 'Not specified'} in ${userProfile.degree || 'N/A'}
- **Academic Performance**: GPA ${userProfile.gpa || 'Not provided'} ${userProfile.gpa ? (parseFloat(userProfile.gpa) >= 3.5 ? '(Strong! 🌟)' : parseFloat(userProfile.gpa) >= 3.0 ? '(Competitive)' : '(Consider improvement strategies)') : ''}
- **Target Degree**: ${userProfile.studyGoal || 'Not specified'}
- **Target Field**: ${userProfile.targetField || 'Not specified'}
- **Intake**: ${userProfile.targetIntake || 'Not specified'}
- **Budget Range**: $${userProfile.budgetMin || 0} - $${userProfile.budgetMax || 0}/year ${userProfile.budgetMax ? (userProfile.budgetMax >= 50000 ? '(High-tier options available)' : userProfile.budgetMax >= 30000 ? '(Mid-tier focused)' : '(Budget-conscious strategy)') : ''}
- **Funding Plan**: ${userProfile.fundingPlan || 'Not specified'}
- **Preferred Countries**: ${userProfile.preferredCountries?.join(', ') || 'Open to all destinations'}
- **Exam Status**: ${userProfile.examStatus || 'Not specified'}
- **Test Scores**: ${userProfile.examScores || 'Not provided'}
- **SOP Status**: ${userProfile.sopStatus || 'Not started'}
- **Profile Strength**: ${strengthPercent}% (${completedCount}/${totalItems} key milestones reached)
${userProfile.lockedUniversityId ? `- **🔒 Locked University**: ${lockedUniName} (Application Phase Active)` : ''}
${userProfile.tasks?.length > 0 ? `\n## Current To-Do List:
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
- Use **Markdown formatting** for structure (headers, bold, lists, tables)
- **Numbered Lists**: When listing universities, ALWAYS use numbered lists (1, 2, 3...) for clarity.
- **Detailed Bullet Points**: Under each university, use sub-bullets for Tuition, Ranking, and key programs.
- Keep responses **conversational but data-driven**
- Cite specific numbers (acceptance rates, tuition, rankings)
- End with 2-3 **personalized action items**
- Use emojis sparingly for emphasis (🎯, ✅, ⚠️, 💰)

## 🌐 LANGUAGE CONSISTENCY:
- **ALWAYS** respond in the same language the user is using.
- **Default to English** if the language is ambiguous.
- If they speak Hindi, respond in Hindi.
- **NEVER** switch to a different language (like Vietnamese, Spanish, etc.) unless explicitly asked.

## 🎙️ CALL MODE ROBUSTNESS:
- In Voice/Call Mode, transcripts can be "noisy" (e.g., "IND" instead of "IN").
- Be patient and use context to guess the user's intent.
- NEVER assume the conversation is ending based on a single ambiguous word like "end" or "close" unless the context is 100% clear.
- If unsure, ask for clarification: "I didn't quite catch that, did you mean...?"

## 💰 CREDIT EFFICIENCY RULE (CRITICAL):
Keep your responses **punchy and concise**. 
- Avoid long essays.
- Target response length: **under 1000 characters** whenever possible.
- If you have a lot of data (like a table), present it briefly and offer to explain details ONLY if the user asks.
- This saves the user's voice credits and keeps the conversation fluid.

## Taking Actions (CRITICAL):
You can take real actions in the system by including specific tags in your response. 

### ⚠️ PERMISSION RULE:
Before creating a **Task** or **Locking** a university, you MUST first ask for permission in plain text/voice.
- **BAD**: "I am creating a task for you. [ACTION: task, ...]"
- **GOOD**: "Would you like me to add a task to your to-do list for brainstorming your SOP? Please say yes or no."
- Only after the user says "Yes" or gives clear consent, you should include the action tag in your NEXT response.

1. **Shortlist a University**: [ACTION: shortlist, UNIVERSITY_ID] (Shortlisting is fine to do directly)
2. **Lock a University**: [ACTION: lock, UNIVERSITY_ID] (MUST ask permission first)
3. **Create a Task**: [ACTION: task, TASK_TITLE, PRIORITY, STAGE] (Priorities: high, medium, low) (STAGE: 1, 2, 3, or 4) (MUST ask permission first)
4. **Create a Document**: [ACTION: document, DOCUMENT_TITLE, TYPE] (e.g., SOP, Resume)

## 📄 DOCUMENT WORKSPACE (PHASE 4):
- You can now tell the user you've empowered them with a **Document Workspace**.
- If the user asks for an SOP or Resume draft, provide an excellent, detailed draft in Markdown format.
- **CRITICAL FOR DOCUMENTS**: When creating a document, wrap the actual document content (e.g., the SOP text) between \`[[[DOC_CONTENT_START]]]\` and \`[[[DOC_CONTENT_END]]]\` tags. Your conversational response (like "Sure, I've drafted that for you") should stay OUTSIDE these tags and add this in Documents page (necessary).
- **EXEMPTION**: Document drafts are exempt from the 1000-character length rule. Provide a full, professional draft.
- Inform them that they can find this draft in the **Documents** section, where they can edit it and **Export as professional PDF**.
- Encourage them to use the "Export PDF" feature for their final submissions.

### 🚀 PROACTIVE GUIDANCE:
Instead of just asking "How can I help?", look at the user's current status and **suggest a specific task**.
Example: "I see your SOP is not started. Should I create a task for you to draft the first paragraph? (Yes/No)"
Example: "I've drafted a baseline SOP for you! You can now find it in your **Documents Vault** to refine and export as PDF."
Example of Action: "Perfect! I've added that task for you. [ACTION: task, Draft SOP Intro, high]"

Example: "As you agreed, I've added the SOP brainstorm task for you. [ACTION: task, Brainstorm SOP, high]"

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
5. Target Intake Year (e.g., Fall 2025)
6. Preferred Countries
7. Maximum Budget and Funding Plan (Self, Scholarship, Loan)
8. Exam Status and SOP Status (Not started, Draft, ready)

Rules:
- Ask only 1-2 questions at a time to not overwhelm the student.
- Be professional, encouraging and clear.
- Once you have collected enough information to form a solid profile, provide a friendly summary and then append this EXACT format at the very end of your message:
[DATA: {"education": "...", "degree": "...", "gpa": "...", "studyGoal": "...", "targetIntake": "...", "preferredCountries": ["..."], "budgetMax": 50000, "fundingPlan": "...", "examStatus": "...", "examScores": "...", "sopStatus": "..."}]
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

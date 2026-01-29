# Product Requirements Document (PRD)
## AI Counsellor - Study Abroad Guidance Platform

**Version:** 1.0  
**Last Updated:** January 25, 2026  
**Document Owner:** Development Team  
**Status:** Draft

---

## 1. Executive Summary

**AI Counsellor** is a stage-based, AI-powered platform that guides students through the study-abroad decision process. Unlike generic chatbots or overwhelming university listing sites, this platform provides structured, personalized guidance from profile building to university locking and application preparation.

### Vision
Transform the overwhelming study-abroad process into a clear, guided journey where students make confident, informed decisions at every stage.

### Success Metrics
- **User Completion Rate**: >70% of users complete onboarding
- **AI Engagement**: >60% of users interact with AI Counsellor 3+ times
- **University Locking**: >50% of users lock at least one university
- **User Satisfaction**: Net Promoter Score (NPS) >40

---

## 2. Problem Statement

### Current Pain Points
1. **Information Overload**: Students face thousands of universities with no clear filtering logic
2. **Generic Advice**: Chatbots provide surface-level responses without personalization
3. **Decision Paralysis**: No structured guidance leads to delayed or poor decisions
4. **Fragmented Experience**: Multiple tools required for research, planning, and application tracking

### Target Users
- **Primary**: Undergraduate and graduate students (18-28 years)
- **Geography**: Global, with focus on students targeting US, UK, Canada, Australia
- **Profile**: Students planning study abroad 6-18 months in advance

---

## 3. Product Goals

### Must Have (P0)
1. **Structured User Onboarding** → Complete profile collection
2. **AI Counsellor Agent** → Personalized recommendations with reasoning
3. **University Discovery** → Filter-based search with profile matching
4. **University Locking** → Commitment mechanism for focused application
5. **Stage-Based Progression** → Clear journey visualization

### Should Have (P1)
6. **Task Management** → AI-generated to-dos based on locked universities
7. **Profile Strength Analysis** → Show gaps and recommendations
8. **Conversational Onboarding** → Voice-based alternative to form filling

### Nice to Have (P2)
9. **Document Upload & Management**
10. **Scholarship Discovery**
11. **Application Timeline Tracking**
12. **Peer Comparison** (anonymized)

---

## 4. User Journey & Flow

### 4.1 Landing & Authentication

#### Landing Page
**Purpose**: Immediate value proposition and trust building

**Components**:
- Hero section with clear value proposition
- Trust indicators (testimonials, university logos, stats)
- CTA: "Get Started" and "Login"
- Brief explanation of the 4-stage process

**User Story**:
> "As a prospective student, I want to immediately understand what this platform does and how it helps me, so I can decide if it's worth signing up."

#### Authentication Flow
**Methods**:
- Email/Password signup
- Google OAuth (recommended)
- Email verification required

**Post-Signup Behavior**:
- New users → Redirect to onboarding
- Returning users with incomplete onboarding → Block dashboard, show onboarding prompt
- Returning users with complete profile → Redirect to dashboard

---

### 4.2 Onboarding (Mandatory Gate)

**Purpose**: Collect minimum viable profile data to power AI recommendations

**Completion Criteria**: All sections must have responses

#### Section A: Academic Background
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Current Education Level | Select | Yes | High School / Bachelor's / Master's |
| Major/Field of Study | Text | Yes | Free text with suggestions |
| Graduation Year | Date | Yes | Month + Year |
| GPA/Percentage | Number | No | Optional but recommended |

#### Section B: Study Goals
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Target Degree | Select | Yes | Bachelor's / Master's / MBA / PhD |
| Field of Study | Multi-select | Yes | CS, Engineering, Business, etc. |
| Target Intake | Select | Yes | Fall 2026, Spring 2027, etc. |
| Preferred Countries | Multi-select | Yes | USA, UK, Canada, Australia, etc. |

#### Section C: Budget & Funding
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Annual Budget Range | Range Slider | Yes | $10K - $100K+ |
| Funding Plan | Select | Yes | Self-funded / Scholarship / Loan / Mix |
| Budget Flexibility | Select | No | Strict / Moderate / Flexible |

#### Section D: Exam Readiness
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| English Test Status | Select | Yes | Not Started / Scheduled / Completed |
| English Test Score | Text | Conditional | If completed |
| GRE/GMAT Status | Select | Yes | Not Started / Scheduled / Completed |
| GRE/GMAT Score | Text | Conditional | If completed |
| SOP Status | Select | Yes | Not Started / Draft / Ready |

**Onboarding Modes**:
1. **Form Mode** (Default): Step-by-step wizard with progress indicator
2. **AI Mode** (P1): Conversational voice-based onboarding

**User Story**:
> "As a new user, I want to complete my profile quickly without feeling overwhelmed, so I can start getting personalized recommendations."

---

### 4.3 Dashboard (Control Center)

**Purpose**: Answer three questions at a glance:
1. Where am I in the journey?
2. What should I do next?
3. How strong is my profile?

#### Layout Sections

##### A. Profile Summary Card
- **Display**: Name, target degree, intake, budget range
- **Action**: "Edit Profile" button
- **Visual**: Avatar/icon + key metrics

##### B. Stage Indicator (Progress Tracker)
**4 Stages**:
1. 🟢 **Building Profile** → Onboarding complete
2. 🔵 **Discovering Universities** → Browsing and shortlisting
3. 🟡 **Finalizing Universities** → At least 1 university locked
4. 🟣 **Preparing Applications** → Task completion mode

**Visual Treatment**: Horizontal stepper or vertical timeline with current stage highlighted

##### C. Profile Strength Analysis
**Categories**:
- **Academics**: Strong / Average / Weak (based on GPA/test scores)
- **Test Readiness**: Complete / In Progress / Not Started
- **Documentation**: Ready / Partial / Missing

**Display**: Progress bars or circular indicators with color coding

##### D. AI-Generated To-Do List
**Example Tasks**:
- "Complete TOEFL by March 2026"
- "Shortlist 3 'Target' universities"
- "Draft SOP for University of XYZ"

**Functionality**:
- Mark as complete
- Dismiss
- Get AI help for specific task

##### E. Quick Actions
- "Talk to AI Counsellor"
- "Discover Universities"
- "View Shortlisted Universities"

**User Story**:
> "As a returning user, I want to instantly see my progress and next steps, so I don't waste time figuring out what to do."

---

### 4.4 AI Counsellor (Core Intelligence)

**Purpose**: Act as a reasoning agent that understands context, explains decisions, and takes actions

#### Capabilities

**1. Profile Analysis**
- Explain strengths: "Your GPA of 3.8 is competitive for top-tier programs"
- Identify gaps: "Your TOEFL score is below the average for your target universities"
- Provide strategic recommendations

**2. University Recommendations**
**Categorization Logic**:
- **Dream** (10-30% acceptance chance): Aspirational universities
- **Target** (40-70% acceptance chance): Strong match
- **Safe** (75%+ acceptance chance): High likelihood

**Explanation Format**:
```
University of ABC
Category: Target
Fit Score: 78/100

Why it fits:
✅ Your CS background aligns with their research focus
✅ Budget ($45K/year) is within your range
⚠️ Your GRE score is slightly below median (315 vs 320)

Acceptance Probability: ~60%
```

**3. Actionable Commands**
The AI can execute:
- `Add to shortlist`
- `Lock university`
- `Create task: [task description]`
- `Update budget filter`

**4. Context Awareness**
- Knows user's current stage
- References previously shortlisted universities
- Adapts recommendations based on profile changes

#### Interface Modes
1. **Chat Interface** (P0): Text-based conversation
2. **Voice Interface** (P1): Speech-to-text and text-to-speech

**User Story**:
> "As a confused student, I want to ask why a university was recommended and get a clear, reasoned explanation, so I can make informed decisions."

---

### 4.5 University Discovery

**Purpose**: Intelligent filtering and matching based on user profile

#### Discovery Interface

##### Filters
**Profile-Based (Auto-Applied)**:
- Budget range
- Target countries
- Field of study
- Exam scores (if provided)

**User-Controlled**:
- Location (city-level)
- University type (Public / Private)
- Ranking tier
- Scholarship availability
- Program duration

##### University Card Display
**Information**:
- University name + logo
- Location + country flag
- Program name
- Annual cost
- Profile match score (percentage)
- Risk level badge (Dream / Target / Safe)
- Quick action: "Shortlist" or "Already Shortlisted"

##### Sorting Options
- Best Match (default)
- Lowest Cost
- Highest Ranking
- Acceptance Probability

**User Story**:
> "As a student, I want to filter universities that match my budget and profile, so I don't waste time on unrealistic options."

---

### 4.6 University Locking (Commitment Gate)

**Purpose**: Force focused decision-making and prevent application paralysis

#### Behavior Rules
1. **Minimum Requirement**: Lock at least 1 university to access application guidance
2. **Maximum Recommendation**: Lock 3-5 universities (AI suggests optimal number)
3. **Unlocking Warning**: "Unlocking will reset application tasks. Are you sure?"

#### Lock Flow
**Trigger**: User clicks "Lock University" on shortlisted item

**Confirmation Modal**:
```
You're about to lock [University Name]

This means:
✅ Personalized application tasks will be generated
✅ Deadlines will be tracked
⚠️ You can unlock later, but tasks may reset

Proceed with locking?
[Cancel] [Lock University]
```

**Post-Lock Actions**:
- Move to Stage 4: "Preparing Applications"
- Generate university-specific to-do list
- Show application timeline

**User Story**:
> "As a student, I need a forcing function to commit to specific universities, so I can focus on application quality instead of endless research."

---

### 4.7 Application Guidance & To-Dos

**Purpose**: Provide structured, actionable steps for locked universities

#### Task Categories

**1. Pre-Application**
- [ ] Register on university portal
- [ ] Request transcripts
- [ ] Prepare financial documents

**2. Documentation**
- [ ] Draft SOP (university-specific)
- [ ] Collect 2-3 recommendation letters
- [ ] Update CV/Resume

**3. Testing**
- [ ] Complete TOEFL/IELTS
- [ ] Send official test scores
- [ ] Complete any additional tests (GRE Subject, etc.)

**4. Submission**
- [ ] Complete application form
- [ ] Upload all documents
- [ ] Pay application fee
- [ ] Submit before deadline

#### Task Details
Each task shows:
- **Title** & **Description**
- **Deadline** (university-specific)
- **Priority** (High / Medium / Low)
- **Status** (Not Started / In Progress / Complete)
- **AI Help**: "Ask AI Counsellor for guidance on this task"

**User Story**:
> "As a student preparing applications, I want a clear checklist with deadlines, so I don't miss critical steps."

---

### 4.8 Profile Management

**Purpose**: Allow users to update information and see impact on recommendations

#### Editable Sections
- All onboarding fields
- Additional fields: Work experience, research background, publications

#### Auto-Updates on Profile Change
1. **Recalculate** university match scores
2. **Update** Dream/Target/Safe categorizations
3. **Refresh** AI Counsellor recommendations
4. **Regenerate** to-do tasks if necessary

**User Story**:
> "As a student who just completed TOEFL, I want to update my score and immediately see how it improves my university matches."

---

## 5. Feature Specifications

### 5.1 AI Counsellor Intelligence

**AI Model Requirements**:
- **Recommended**: Google Gemini (free tier) or GPT-4o-mini
- **Fallback**: Claude or open-source LLM (Llama, Mistral)

**Context Management**:
```typescript
interface AIContext {
  userProfile: UserProfile;
  currentStage: Stage;
  shortlistedUniversities: University[];
  lockedUniversities: University[];
  recentTasks: Task[];
  conversationHistory: Message[];
}
```

**Prompt Engineering Strategy**:
- System prompt with role definition: "You are an expert study-abroad counsellor"
- Inject user profile as structured data
- Include action capability documentation
- Use JSON mode for structured responses

**Action Extraction**:
AI responses must support function calling:
```json
{
  "message": "I've added MIT to your shortlist",
  "actions": [
    {
      "type": "SHORTLIST_UNIVERSITY",
      "payload": { "universityId": "mit-cs-masters" }
    }
  ]
}
```

---

### 5.2 University Data & Matching

**Data Source Options**:
1. **Research-based**: Manually curated dataset (50-100 universities)
2. **API Integration**: 
   - Hipo Campus API
   - Universities API by HIPO
   - Custom scraping (ethical, rate-limited)
3. **Hybrid**: Core dataset + API enrichment

**Matching Algorithm** (Simplified):
```
Match Score = (
  Budget Match × 0.3 +
  Academic Fit × 0.25 +
  Test Score Fit × 0.2 +
  Field Alignment × 0.15 +
  Location Preference × 0.1
) × 100
```

**Categorization Logic**:
- **Dream**: Match Score 50-69% OR user's top aspirational choices
- **Target**: Match Score 70-85%
- **Safe**: Match Score 86-100%

---

### 5.3 Task Management

**Task Sources**:
1. **AI-Generated**: Based on locked university requirements
2. **Template-Based**: Standard tasks (TOEFL, SOP, etc.)
3. **User-Created**: Custom to-dos

**Task Schema**:
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'PRE_APP' | 'DOCUMENTATION' | 'TESTING' | 'SUBMISSION';
  universityId?: string; // Null for general tasks
  deadline?: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  aiGenerated: boolean;
  createdAt: Date;
}
```

---

## 6. Non-Functional Requirements

### Performance
- **Page Load**: <2s on 4G connection
- **AI Response Time**: <5s for typical queries
- **Search/Filter**: <1s for university discovery

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios ≥4.5:1

### Security
- Password hashing (bcrypt, min 10 rounds)
- JWT-based authentication with refresh tokens
- Rate limiting on AI endpoints (10 requests/minute)
- Input sanitization and validation

### Scalability
- Support 1000+ concurrent users (hackathon scope)
- Database indexing on frequently queried fields
- Caching for university data (Redis or in-memory)

---

## 7. Out of Scope (V1)

❌ Real university application submissions  
❌ Payment processing for application fees  
❌ Visa application guidance  
❌ Accommodation and travel booking  
❌ Multi-language support  
❌ Mobile native apps (iOS/Android)  
❌ Community forums or peer messaging  
❌ Document editing tools (SOP builder, CV creator)  

---

## 8. Success Criteria

### Functional Completeness
- ✅ User can complete onboarding
- ✅ AI Counsellor provides reasoned recommendations
- ✅ User can discover, shortlist, and lock universities
- ✅ Tasks are generated for locked universities
- ✅ Profile edits update recommendations

### Quality Gates
- ✅ Zero critical bugs in core flow
- ✅ AI responses are contextually relevant >90% of the time
- ✅ Mobile-responsive on 375px+ screens
- ✅ Passes accessibility audit (WAVE or Lighthouse)

### User Experience
- ✅ Average time to complete onboarding: <5 minutes
- ✅ Users can explain their stage and next steps without help
- ✅ AI Counsellor feels helpful, not generic

---

## 9. Appendix

### Glossary
- **Dream University**: Aspirational choice with lower acceptance probability
- **Target University**: Strong profile match with moderate acceptance probability
- **Safe University**: High acceptance probability based on profile
- **Locking**: Committing to a university for focused application preparation
- **Stage**: Current position in the 4-phase journey

### References
- Hackathon Task Document: `hackathon-task.md`
- Loom Video Transcript: `loom-video-transcript.txt`

---

**Document Status**: Ready for Technical & Design Requirements Definition  
**Next Steps**: Create TRD and DRD based on these product requirements

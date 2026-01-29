# Technical Requirements Document (TRD)
## AI Counsellor - Study Abroad Guidance Platform

**Version:** 1.0  
**Last Updated:** January 25, 2026  
**Document Owner:** Engineering Team  
**Status:** Draft

---

## 1. Technical Overview

### Architecture Philosophy
- **Modern Full-Stack**: TypeScript-first development
- **Component-Driven**: Reusable, accessible, production-ready components
- **API-First**: Clear separation between frontend and backend
- **AI-Native**: LLM integration as core infrastructure, not an add-on

### Tech Stack Summary

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 15 (App Router) | Server components, streaming, built-in optimization |
| **UI Library** | shadcn/ui + Radix UI | Accessible, customizable, production-ready components |
| **Styling** | Tailwind CSS v4 | Utility-first, design system friendly |
| **Backend** | Next.js API Routes / tRPC | Type-safe APIs, reduced boilerplate |
| **Database** | PostgreSQL 16 + Prisma ORM | Relational integrity, type-safe queries |
| **Authentication** | Better Auth | Modern, secure, session-based auth with OAuth |
| **AI/LLM** | Vercel AI SDK + Gemini 2.0 | Streaming responses, tool calling, cost-effective |
| **State Management** | Zustand + React Query | Lightweight client state + server state |
| **Validation** | Zod | Runtime type safety, form validation |
| **Deployment** | Vercel | Zero-config, edge functions, preview deployments |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  Next.js 15 App Router + React 19 + shadcn/ui Components   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (tRPC)                        │
│  Type-Safe Procedures + Middleware (Auth, Logging, etc.)    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────┬──────────────────┬──────────────────────┐
│  Auth Service    │  AI Service      │  University Service  │
│  (Better Auth)   │  (Gemini 2.0)    │  (Prisma + Cache)    │
└──────────────────┴──────────────────┴──────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL + Prisma)            │
│  Users, Profiles, Universities, Tasks, Conversations, etc.  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Next.js 15 App Router Structure

```
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   └── layout.tsx                # Auth layout (centered, no nav)
│
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── onboarding/
│   │   └── page.tsx              # Multi-step onboarding wizard
│   ├── universities/
│   │   ├── page.tsx              # Discovery page
│   │   ├── [id]/
│   │   │   └── page.tsx          # University detail page
│   │   └── shortlisted/
│   │       └── page.tsx          # Shortlisted universities
│   ├── ai-counsellor/
│   │   └── page.tsx              # AI chat interface
│   ├── tasks/
│   │   └── page.tsx              # Task management
│   ├── profile/
│   │   └── page.tsx              # Profile edit
│   └── layout.tsx                # Dashboard layout (sidebar/header)
│
├── page.tsx                      # Landing page
├── layout.tsx                    # Root layout
└── api/
    ├── auth/[...all]/            # Better Auth routes
    └── trpc/[trpc]/              # tRPC handler
```

### 3.2 Component Architecture (shadcn/ui + Custom)

**Component Categories**:

#### 1. shadcn/ui Base Components (Install via CLI)
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add progress
npx shadcn@latest add slider
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add dropdown-menu
```

#### 2. Custom Composite Components
```
src/components/
├── ui/                           # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
│
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── SocialAuthButtons.tsx
│
├── onboarding/
│   ├── OnboardingWizard.tsx      # Main wizard container
│   ├── StepIndicator.tsx         # Progress visualization
│   ├── steps/
│   │   ├── AcademicStep.tsx
│   │   ├── GoalsStep.tsx
│   │   ├── BudgetStep.tsx
│   │   └── ExamsStep.tsx
│
├── dashboard/
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── ProfileSummaryCard.tsx
│   ├── StageIndicator.tsx
│   ├── ProfileStrength.tsx
│   └── TodoList.tsx
│
├── universities/
│   ├── UniversityCard.tsx
│   ├── UniversityFilters.tsx
│   ├── UniversityDetail.tsx
│   ├── LockUniversityModal.tsx
│   └── MatchScoreIndicator.tsx
│
├── ai-counsellor/
│   ├── ChatInterface.tsx
│   ├── MessageBubble.tsx
│   ├── ActionButtons.tsx         # AI-suggested actions
│   ├── TypingIndicator.tsx
│   └── VoiceInput.tsx            # P1 feature
│
└── tasks/
    ├── TaskCard.tsx
    ├── TaskList.tsx
    └── TaskTimeline.tsx
```

#### 3. Design System Configuration
```typescript
// src/lib/design-system.ts
export const designTokens = {
  colors: {
    primary: 'hsl(221, 83%, 53%)',      // Modern blue
    secondary: 'hsl(142, 76%, 36%)',    // Success green
    accent: 'hsl(280, 100%, 65%)',      // Purple accent
    danger: 'hsl(0, 84%, 60%)',         // Error red
    warning: 'hsl(38, 92%, 50%)',       // Warning orange
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 47%, 11%)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter Variable', 'system-ui', 'sans-serif'],
      display: ['Cal Sans', 'Inter Variable', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    unit: 4, // Base unit in px
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

### 3.3 State Management Strategy

#### Client State (Zustand)
**Use for**: UI state, form wizards, modals, temporary filters

```typescript
// src/stores/onboarding-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentStep: number;
  formData: Partial<OnboardingData>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      formData: {},
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      resetOnboarding: () => set({ currentStep: 0, formData: {} }),
    }),
    { name: 'onboarding-storage' }
  )
);
```

#### Server State (React Query via tRPC)
**Use for**: Database entities, API data, caching

```typescript
// Example: Fetching universities
const { data: universities, isLoading } = trpc.university.discover.useQuery({
  filters: {
    budget: [20000, 50000],
    countries: ['USA', 'UK'],
    fieldOfStudy: 'Computer Science',
  },
});
```

---

## 4. Backend Architecture

### 4.1 tRPC Setup

**Why tRPC?**
- End-to-end type safety (no code generation)
- Reduced API boilerplate
- Built-in React Query integration
- Excellent DX with autocomplete

**Router Structure**:
```typescript
// src/server/routers/_app.ts
import { authRouter } from './auth';
import { userRouter } from './user';
import { universityRouter } from './university';
import { aiRouter } from './ai';
import { taskRouter } from './task';
import { router } from '../trpc';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  university: universityRouter,
  ai: aiRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
```

**Example Router**:
```typescript
// src/server/routers/university.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { calculateMatchScore } from '../services/university-matcher';

export const universityRouter = router({
  discover: protectedProcedure
    .input(
      z.object({
        filters: z.object({
          budget: z.tuple([z.number(), z.number()]),
          countries: z.array(z.string()),
          fieldOfStudy: z.string(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const universities = await ctx.db.university.findMany({
        where: {
          country: { in: input.filters.countries },
          annualCost: {
            gte: input.filters.budget[0],
            lte: input.filters.budget[1],
          },
        },
      });

      // Enrich with match scores
      return universities.map((uni) => ({
        ...uni,
        matchScore: calculateMatchScore(uni, ctx.user.profile),
      }));
    }),

  shortlist: protectedProcedure
    .input(z.object({ universityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shortlistedUniversity.create({
        data: {
          userId: ctx.user.id,
          universityId: input.universityId,
        },
      });
    }),

  lock: protectedProcedure
    .input(z.object({ universityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Lock university
      const locked = await ctx.db.lockedUniversity.create({
        data: {
          userId: ctx.user.id,
          universityId: input.universityId,
          lockedAt: new Date(),
        },
      });

      // Trigger task generation
      await generateApplicationTasks(ctx.user.id, input.universityId);

      return locked;
    }),
});
```

### 4.2 Middleware

**Authentication Middleware**:
```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';

const t = initTRPC.context<Context>().create();

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: ctx.headers });

  if (!session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});
```

**Logging Middleware**:
```typescript
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  console.log(`[${type}] ${path} - ${duration}ms`);
  return result;
});
```

---

## 5. Database Design (Prisma + PostgreSQL)

### 5.1 Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============ AUTH & USER ============
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  profile              UserProfile?
  sessions             Session[]
  accounts             Account[]
  shortlistedUnis      ShortlistedUniversity[]
  lockedUnis           LockedUniversity[]
  tasks                Task[]
  conversations        Conversation[]

  @@index([email])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  provider          String  // 'google', 'credentials'
  providerAccountId String?
  accessToken       String? @db.Text
  refreshToken      String? @db.Text
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

// ============ USER PROFILE ============
model UserProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Academic Background
  currentEducationLevel String   // 'HIGH_SCHOOL', 'BACHELORS', 'MASTERS'
  major                 String
  graduationYear        DateTime
  gpa                   Float?

  // Study Goals
  targetDegree          String   // 'BACHELORS', 'MASTERS', 'MBA', 'PHD'
  fieldOfStudy          String[]
  targetIntake          String   // 'FALL_2026', 'SPRING_2027'
  preferredCountries    String[]

  // Budget
  budgetMin             Int
  budgetMax             Int
  fundingPlan           String   // 'SELF', 'SCHOLARSHIP', 'LOAN', 'MIX'

  // Exam Readiness
  englishTestStatus     String   // 'NOT_STARTED', 'SCHEDULED', 'COMPLETED'
  englishTestScore      String?
  greGmatStatus         String
  greGmatScore          String?
  sopStatus             String   // 'NOT_STARTED', 'DRAFT', 'READY'

  // Meta
  onboardingComplete    Boolean  @default(false)
  currentStage          String   @default("BUILDING_PROFILE")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([userId])
}

// ============ UNIVERSITIES ============
model University {
  id                String   @id @default(cuid())
  name              String
  country           String
  city              String
  logo              String?
  website           String?
  ranking           Int?
  type              String   // 'PUBLIC', 'PRIVATE'
  
  // Programs (simplified - in production, this would be a separate model)
  programs          Json     // Array of program objects

  // Costs
  annualCost        Int
  applicationFee    Int?

  // Acceptance Data
  acceptanceRate    Float?
  medianGPA         Float?
  medianGRE         Int?
  medianTOEFL       Int?

  // Relations
  shortlisted       ShortlistedUniversity[]
  locked            LockedUniversity[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([country])
  @@index([annualCost])
}

model ShortlistedUniversity {
  id            String     @id @default(cuid())
  userId        String
  universityId  String
  category      String?    // 'DREAM', 'TARGET', 'SAFE'
  matchScore    Float?
  addedAt       DateTime   @default(now())

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  university    University @relation(fields: [universityId], references: [id], onDelete: Cascade)

  @@unique([userId, universityId])
  @@index([userId])
}

model LockedUniversity {
  id            String     @id @default(cuid())
  userId        String
  universityId  String
  lockedAt      DateTime   @default(now())

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  university    University @relation(fields: [universityId], references: [id], onDelete: Cascade)

  @@unique([userId, universityId])
  @@index([userId])
}

// ============ TASKS ============
model Task {
  id            String    @id @default(cuid())
  userId        String
  universityId  String?   // Null for general tasks
  title         String
  description   String?   @db.Text
  type          String    // 'PRE_APP', 'DOCUMENTATION', 'TESTING', 'SUBMISSION'
  priority      String    // 'HIGH', 'MEDIUM', 'LOW'
  status        String    @default("NOT_STARTED")
  deadline      DateTime?
  aiGenerated   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
}

// ============ AI CONVERSATIONS ============
model Conversation {
  id        String    @id @default(cuid())
  userId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  Message[]

  @@index([userId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  role           String       // 'user', 'assistant', 'system'
  content        String       @db.Text
  actions        Json?        // Structured actions taken by AI
  createdAt      DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}
```

### 5.2 Database Operations Best Practices

**1. Use Transactions for Related Operations**:
```typescript
// Example: Locking a university and generating tasks
await prisma.$transaction(async (tx) => {
  await tx.lockedUniversity.create({
    data: { userId, universityId },
  });

  await tx.task.createMany({
    data: generateTasksForUniversity(userId, universityId),
  });

  await tx.userProfile.update({
    where: { userId },
    data: { currentStage: 'PREPARING_APPLICATIONS' },
  });
});
```

**2. Implement Soft Deletes for Audit Trail**:
```prisma
model University {
  // ... other fields
  deletedAt DateTime?
}
```

**3. Use Connection Pooling**:
```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 6. Authentication (Better Auth)

### 6.1 Setup

**Why Better Auth?**
- Modern session-based auth (stateless JWT alternative)
- Built-in OAuth providers (Google, GitHub, etc.)
- TypeScript-first, edge-compatible
- Automatic CSRF protection

**Configuration**:
```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});
```

**Client Setup**:
```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

**Usage in Components**:
```typescript
'use client';

import { useSession, signOut } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton />;
  if (!session) return <LoginButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 7. AI Integration (Vercel AI SDK + Gemini)

### 7.1 Setup

**Installation**:
```bash
npm install ai @google/generative-ai
```

**Configuration**:
```typescript
// src/lib/ai.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export const registry = createProviderRegistry({
  google: genAI,
});

export const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});
```

### 7.2 AI Counsellor Implementation

**Streaming Chat API**:
```typescript
// src/app/api/ai/chat/route.ts
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { model } from '@/lib/ai';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { messages } = await req.json();

  // Fetch user profile for context
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  const systemPrompt = `You are an expert study-abroad counsellor helping ${profile?.name || 'a student'}.

Student Profile:
- Target Degree: ${profile?.targetDegree}
- Field: ${profile?.fieldOfStudy?.join(', ')}
- Budget: $${profile?.budgetMin} - $${profile?.budgetMax}
- Countries: ${profile?.preferredCountries?.join(', ')}
- Current Stage: ${profile?.currentStage}

Your role:
1. Analyze their profile and provide reasoned recommendations
2. Explain WHY a university fits or doesn't fit
3. Help them make confident decisions
4. Use tools to take actions (shortlist, lock universities, create tasks)

Be concise, encouraging, and data-driven.`;

  const result = await streamText({
    model,
    system: systemPrompt,
    messages,
    tools: {
      shortlistUniversity: tool({
        description: 'Add a university to the user\'s shortlist',
        parameters: z.object({
          universityId: z.string(),
          reason: z.string(),
        }),
        execute: async ({ universityId, reason }) => {
          await prisma.shortlistedUniversity.create({
            data: {
              userId: session.user.id,
              universityId,
            },
          });
          return { success: true, message: `Added to shortlist: ${reason}` };
        },
      }),
      createTask: tool({
        description: 'Create a task for the user',
        parameters: z.object({
          title: z.string(),
          description: z.string().optional(),
          deadline: z.string().optional(),
          priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
        }),
        execute: async (params) => {
          await prisma.task.create({
            data: {
              userId: session.user.id,
              title: params.title,
              description: params.description,
              deadline: params.deadline ? new Date(params.deadline) : null,
              priority: params.priority,
              type: 'DOCUMENTATION',
              aiGenerated: true,
            },
          });
          return { success: true };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

**Client-Side Chat Component**:
```typescript
'use client';

import { useChat } from 'ai/react';
import { MessageBubble } from '@/components/ai-counsellor/MessageBubble';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask the AI Counsellor..."
        />
      </form>
    </div>
  );
}
```

### 7.3 University Matching Algorithm

**Service Layer**:
```typescript
// src/server/services/university-matcher.ts
import type { University, UserProfile } from '@prisma/client';

export function calculateMatchScore(
  university: University,
  profile: UserProfile
): number {
  let score = 0;

  // Budget match (30%)
  const budgetMid = (profile.budgetMin + profile.budgetMax) / 2;
  const budgetDiff = Math.abs(university.annualCost - budgetMid);
  const budgetScore = Math.max(0, 100 - (budgetDiff / budgetMid) * 100);
  score += budgetScore * 0.3;

  // Academic fit (25%)
  if (university.medianGPA && profile.gpa) {
    const gpaDiff = Math.abs(university.medianGPA - profile.gpa);
    const gpaScore = Math.max(0, 100 - (gpaDiff / 4.0) * 100);
    score += gpaScore * 0.25;
  } else {
    score += 50 * 0.25; // Neutral score if data missing
  }

  // Test score fit (20%)
  if (university.medianGRE && profile.greGmatScore) {
    const userGRE = parseInt(profile.greGmatScore, 10);
    const scoreDiff = Math.abs(university.medianGRE - userGRE);
    const testScore = Math.max(0, 100 - (scoreDiff / 340) * 100);
    score += testScore * 0.2;
  } else {
    score += 50 * 0.2;
  }

  // Field alignment (15%)
  // In production, match program keywords with user's field of study
  score += 70 * 0.15; // Simplified

  // Location preference (10%)
  if (profile.preferredCountries.includes(university.country)) {
    score += 100 * 0.1;
  }

  return Math.round(score);
}

export function categorizeUniversity(matchScore: number): 'DREAM' | 'TARGET' | 'SAFE' {
  if (matchScore >= 86) return 'SAFE';
  if (matchScore >= 70) return 'TARGET';
  return 'DREAM';
}
```

---

## 8. Performance Optimization

### 8.1 Caching Strategy

**University Data (Static)**:
```typescript
// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedUniversities = unstable_cache(
  async () => {
    return prisma.university.findMany();
  },
  ['universities'],
  { revalidate: 3600 } // 1 hour
);
```

**User-Specific Data (Dynamic)**:
```typescript
// Use React Query's caching via tRPC
const { data } = trpc.user.profile.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 8.2 Database Indexing

**Critical Indexes** (already in schema):
- `User.email` - Auth lookups
- `University.country` - Filtering
- `University.annualCost` - Range queries
- `ShortlistedUniversity.userId` - User-specific queries
- `Task.userId` + `Task.status` - Dashboard performance

### 8.3 Image Optimization

**Next.js Image Component**:
```typescript
import Image from 'next/image';

<Image
  src={university.logo}
  alt={university.name}
  width={64}
  height={64}
  className="rounded-lg"
  loading="lazy"
/>
```

---

## 9. Security Best Practices

### 9.1 Environment Variables

**Required Variables**:
```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/ai_counsellor"
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
BETTER_AUTH_SECRET="your-random-secret-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Validation** (runtime):
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOOGLE_GEMINI_API_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### 9.2 Input Validation

**All Inputs Must Use Zod**:
```typescript
const universityFilterSchema = z.object({
  budget: z.tuple([z.number().min(0), z.number().max(200000)]),
  countries: z.array(z.string()).min(1).max(10),
  fieldOfStudy: z.string().min(1),
});
```

### 9.3 Rate Limiting

**AI Endpoint Protection**:
```typescript
// src/middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function middleware(request: Request) {
  if (request.url.includes('/api/ai')) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
  }
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests (Vitest)

**Setup**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example**:
```typescript
// src/lib/__tests__/university-matcher.test.ts
import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '../university-matcher';

describe('calculateMatchScore', () => {
  it('should return high score for perfect budget match', () => {
    const university = { annualCost: 30000, /* ... */ };
    const profile = { budgetMin: 25000, budgetMax: 35000, /* ... */ };
    
    const score = calculateMatchScore(university, profile);
    expect(score).toBeGreaterThan(80);
  });
});
```

### 10.2 E2E Tests (Playwright)

**Critical Flows to Test**:
1. User signup → Onboarding → Dashboard
2. University discovery → Shortlist → Lock
3. AI Counsellor conversation with action execution
4. Profile edit → Recommendation update

**Example**:
```typescript
// tests/e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('complete onboarding flow', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');

  // Should redirect to onboarding
  await expect(page).toHaveURL('/onboarding');

  // Fill academic background
  await page.selectOption('[name="educationLevel"]', 'BACHELORS');
  await page.fill('[name="major"]', 'Computer Science');
  await page.click('button:has-text("Next")');

  // Continue through all steps...

  // Should redirect to dashboard after completion
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 11. Deployment (Vercel)

### 11.1 Configuration

**vercel.json**:
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "GOOGLE_GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

### 11.2 Database Hosting

**Recommended**: Neon (Serverless Postgres)
- Free tier: 0.5 GB storage
- Auto-scaling
- Branch-based development

**Alternative**: Supabase (Postgres + Auth)

### 11.3 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
```

---

## 12. Monitoring & Logging

### 12.1 Error Tracking

**Sentry Integration**:
```bash
npm install @sentry/nextjs
```

**Configuration**:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### 12.2 Analytics

**Vercel Analytics** (built-in):
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 13. Development Workflow

### 13.1 Scripts

**package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

### 13.2 Git Workflow

**Branching**:
- `main` - Production
- `develop` - Development
- `feature/*` - Feature branches

**Commit Convention** (Conventional Commits):
```
feat: Add university locking modal
fix: Resolve onboarding step navigation bug
chore: Update dependencies
docs: Update TRD with caching strategy
```

---

## 14. Appendix

### 14.1 Technology Decisions

| Decision | Reasoning |
|----------|-----------|
| **Next.js over Vite+React** | Server components, built-in optimization, deployment simplicity |
| **tRPC over REST** | End-to-end type safety, reduced boilerplate, better DX |
| **Prisma over Raw SQL** | Type-safe queries, migrations, excellent TypeScript support |
| **Better Auth over NextAuth** | Modern API, edge-compatible, cleaner implementation |
| **Gemini over OpenAI** | Free tier, competitive performance, tool calling support |
| **PostgreSQL over MongoDB** | Relational integrity, complex queries, ACID compliance |
| **Vercel over AWS** | Zero-config deployment, preview URLs, edge functions |

### 14.2 API References

- **Next.js 15**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **tRPC**: https://trpc.io/docs
- **Better Auth**: https://www.better-auth.com/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **shadcn/ui**: https://ui.shadcn.com

### 14.3 University Data Sources

**Free APIs**:
1. **Hipo Campus API**: https://hipolabs.com/universities
2. **University Domains List**: GitHub - Hipo/university-domains-list
3. **Custom Scraping**: (with rate limiting and robots.txt compliance)

**Seed Data Structure**:
```typescript
// prisma/seed.ts - Example
const universities = [
  {
    name: 'Massachusetts Institute of Technology',
    country: 'USA',
    city: 'Cambridge',
    annualCost: 55000,
    ranking: 1,
    type: 'PRIVATE',
    acceptanceRate: 0.07,
    medianGPA: 3.9,
    medianGRE: 330,
    medianTOEFL: 110,
  },
  // ... more universities
];
```

---

**Document Status**: Ready for Design Requirements Definition  
**Next Steps**: Create DRD with UI/UX specifications, component library, and visual design system

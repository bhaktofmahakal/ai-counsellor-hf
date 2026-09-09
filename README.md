# 🎓 AI Counsellor — Strategic Study Abroad Decision Engine

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-counsellor-hf.vercel.app/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Groq Cloud](https://img.shields.io/badge/AI%20Engine-Groq%20Cloud-f55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![Prisma ORM](https://img.shields.io/badge/Database-Prisma%20%7C%20PostgreSQL-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Upstash Vector](https://img.shields.io/badge/RAG-Upstash%20Vector-00E599?style=for-the-badge&logo=upstash&logoColor=white)](https://upstash.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br />

**Turning student ambiguity into actionable admissions execution.**  
An agentic, stage-based AI platform that moves students from overwhelming college search to finalized university applications.

[Explore Live Demo](https://ai-counsellor-hf.vercel.app/) • [Architecture](#-system-architecture) • [Features](#-core-features) • [Local Setup](#-getting-started)

</div>

---

## 🌟 Executive Overview

Traditional study abroad platforms are static search directories or simple Q&A chatbots that leave students with analysis paralysis. **AI Counsellor** re-imagines college consulting as a **stage-gated, execution-driven decision engine**:

1. **Active Mentorship, Not Passive Chat**: The AI actively extracts student credentials, calculates profile precision scores, and triggers real database state changes.
2. **Autonomous Tool & Action Execution**: Embedded action parsers let the AI create to-do tasks, shortlist programs, lock target universities, and draft application essays directly from conversation.
3. **Commitment-Driven Progression**: Enforces decision discipline through an uncompromised 4-stage pipeline that restricts Phase 4 document generation until the student commits to a locked target university.

---

## 🚀 Live Application

- **Live URL**: [https://ai-counsellor-hf.vercel.app](https://ai-counsellor-hf.vercel.app)
- **Status**: Production Ready & Deployed on Vercel

---

## ✨ Core Features

### 🎙️ 1. Hyper-Fast Agentic AI Counsellor (Call & Voice Mode)
- **Ultra-Low Latency Inference**: Powered by **Groq Cloud** with high-throughput streaming (`openai/gpt-oss-120b` primary with `qwen/qwen3.8-27b` dynamic fallback).
- **Interruptible Call Mode**: Natural, hands-free voice experience with real-time speech recognition and sound synthesis via **ElevenLabs** and Web Speech API. Users can speak mid-sentence to interrupt the AI.
- **Adaptive Personas**:
  - 🏛️ **Strict Ivy Coach**: Tough-love, no-nonsense critique focused on admission flaws and high standards.
  - 🤝 **Friendly Mentor**: Empathetic, confidence-building guidance designed to eliminate application anxiety.
  - 💼 **Career Strategist**: Focuses purely on ROI, employment rates, OPT/visa feasibility, and post-grad salary trends.
  - ⚖️ **Standard Counsellor**: Balanced, comprehensive academic roadmapping.

### ⚡ 2. Autonomous Action & Tag Execution Engine
The AI doesn't just produce text — it modifies state in real time:
- `[ACTION: task, title, priority, stage, description]` — Spawns categorized to-do items in the user's task tracker.
- `[ACTION: shortlist, uni_id]` — Automatically shortlists institutions directly into the student's dashboard.
- `[ACTION: lock, uni_id]` — Commits the student to their top choice after mutual agreement.
- `[ACTION: document, title, type]` — Generates tailored SOPs, resumes, and scholarship essays wrapped in clean delimiters (`[[[DOC_CONTENT_START]]]`).

### 🗺️ 3. The 4-Stage Gated Roadmap
Students progress linearly with clear milestones and measurable accountability:
```
Stage 1: Profile Building  ──►  Stage 2: Discovery  ──►  Stage 3: Shortlisting  ──►  Stage 4: Application Prep
(Credentials & Budget)         (Dream/Target/Safe RAG)   (Filtering & Locking)       (SOPs, Resumes, Portals)
```
- **Precision Score Calculation**: Dynamically measures profile completeness against university entry requirements.
- **Stage Lock Enforcement**: Prevents premature essay drafting until university choices are locked, avoiding generic, untargeted applications.

### 🔍 4. Semantic RAG University Discovery
- **Context-Aware Recommendations**: Uses **Upstash Vector** and **HuggingFace Embeddings** to semantically match students against global university programs based on intent, test waivers, research goals, and tuition constraints.
- **Three-Tier Categorization**:
  - 🌟 **Dream**: High-reach ambitious universities.
  - 🎯 **Target**: Well-aligned, realistic fits.
  - 🛡️ **Safe**: High-probability safety schools with guaranteed budget alignment.

### 📝 5. Ivy League Essay & Document Reviewer
- **Intelligent Scoring**: Evaluates SOPs and admissions essays on a 0–100 scale.
- **Admissions Verdicts**: Categorizes drafts into `Strong Accept`, `Accept`, `Waitlist`, or `Reject`.
- **Targeted Action Plans**: Returns a detailed paragraph of critique along with exactly 3 actionable, high-priority revisions.

### 💼 6. Admissions Mock Interview Simulator
- Simulates rigorous university admissions panels tailored to the student's selected target institution.
- Interactive question-by-question interview flow with real-time feedback and behavioral coaching.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Student / Client]) <--> NextApp[Next.js 15 Web Application]

    subgraph Frontend Layer
        NextApp --> Pages[App Router Pages & Bento UI]
        NextApp --> ZustandStore[Zustand State & Local Persistence]
        NextApp --> CallMode[Voice Engine: Web Speech & ElevenLabs]
    end

    subgraph API & Backend Layer
        NextApp --> APIRoutes[Next.js API Routes]
        APIRoutes --> NextAuth[NextAuth Authentication]
        APIRoutes --> Prisma[Prisma ORM]
    end

    subgraph AI & Data Engine
        APIRoutes --> GroqEngine[Groq Cloud SDK]
        GroqEngine --> PrimaryModel["Primary: openai/gpt-oss-120b"]
        GroqEngine --> FallbackModel["Fallback: qwen/qwen3.8-27b"]
        APIRoutes --> UpstashVector[Upstash Vector DB - Semantic RAG]
        APIRoutes --> Postgres[(PostgreSQL / Supabase)]
        APIRoutes --> UpstashRedis[(Upstash Redis Cache)]
    end
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components & Actions) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), Lucide Icons |
| **Visuals & Shaders** | LiquidChrome WebGL 3D Shader, HeroParallax, Custom Bento Grid |
| **AI Inference** | [Groq SDK](https://groq.com/) (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`) |
| **Vector Search (RAG)** | [Upstash Vector](https://upstash.com/docs/vector/overall/getstarted) + HuggingFace Inference API |
| **Voice & Speech** | ElevenLabs Text-to-Speech API + Web Speech Recognition |
| **Database & ORM** | PostgreSQL ([Supabase](https://supabase.com/)), [Prisma ORM 5](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials, Google OAuth, JWT Session) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence |

---

## 📡 API Endpoints Overview

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/api/ai/chat` | `POST` | SSE Streaming AI Counsellor chat with real-time action parsing |
| `/api/ai/onboarding` | `POST` | Natural language conversational profile builder stream |
| `/api/ai/analyze` | `POST` | One-shot profile analysis and feasibility assessment |
| `/api/review` | `POST` | Strict admissions essay and SOP critique with structured JSON verdict |
| `/api/interview` | `POST` | Dynamic mock admissions interviewer simulation |
| `/api/universities` | `GET` | Filtered & RAG-scored university catalog |
| `/api/shortlist` | `GET/POST/DELETE` | Shortlist management with status transitions |
| `/api/shortlist/lock` | `POST` | Finalize and lock target university choice |
| `/api/tasks` | `GET/POST/PUT/DELETE` | Stage-linked task and deadline management |
| `/api/documents` | `GET/POST/DELETE` | Vault storage for generated SOPs, resumes, and PDFs |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18.x or 20+ installed
- PostgreSQL database (Supabase, Neon, or local instance)
- Free API keys for **Groq Cloud**, **Upstash Vector**, and **HuggingFace**

### 1. Clone the Repository
```bash
git clone https://github.com/bhaktofmahakal/ai-counsellor-hf.git
cd ai-counsellor-hf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root (see [`.env.example`](.env.example)):
```env
# Database (PostgreSQL via Supabase or Neon)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Groq Cloud AI Engine
GROQ_API_KEY="gsk_your_groq_api_key"
GROQ_MODEL="openai/gpt-oss-120b"
GROQ_FALLBACK_MODEL="qwen/qwen3.8-27b"

# Semantic RAG Search
HUGGINGFACE_API_KEY="hf_your_huggingface_api_key"
UPSTASH_VECTOR_REST_URL="https://your-vector-instance.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="your_upstash_vector_token"
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_token"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Voice Integration (Optional)
ELEVENLABS_API_KEY="your_elevenlabs_api_key"
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

### Deploy to Vercel via CLI
```bash
# Production Build & Deploy
npx vercel --prod
```

### Ensure Environment Variables on Vercel
```bash
npx vercel env add GROQ_MODEL production --value "openai/gpt-oss-120b" --yes
npx vercel env add GROQ_FALLBACK_MODEL production --value "qwen/qwen3.8-27b" --yes
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/bhaktofmahakal">Bhaktofmahakal</a></b>
</div>

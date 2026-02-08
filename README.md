# 🎓 AI Counsellor — Your Strategic Study Abroad Mentor

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge&logo=vercel)](https://ai-counsellor-hf.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange?style=for-the-badge)](https://groq.com/)

**AI Counsellor** is a guided, stage-based platform designed to turn student confusion into clarity. Unlike generic chatbots, this is an **Execution-led Decision Engine** that guides students through a strict 4-stage roadmap: from profile building to university locking and application preparation.

---

## 🚀 Live Demo
**Experience the future of education counselling:** [https://ai-counsellor-hf.vercel.app/](https://ai-counsellor-hf.vercel.app/)

---

## ✨ Core Features

### 🧠 1. Agentic AI Counsellor (Call Mode)
Powered by **Groq (Llama 3.3 70B)** for ultra-low latency (<500ms).
- **Interactive Voice**: Speak naturally with your mentor using "Call Mode".
- **Agentic Actions**: The AI doesn't just talk; it creates tasks, shortlists universities, and drafts documents directly in the database using custom action tags.

### 🔍 2. RAG-Powered Discovery
Built using **Upstash Vector DB** for semantic search.
- **Contextual Matching**: Finds universities based on the "intent" of your search, not just keywords.
- **Match Scoring**: Every university is ranked as *Dream, Target, or Safe* based on a custom algorithm comparing student GPA, budget, and goals.

### 🛡️ 3. Decision Discipline (University Locking)
- **Commitment Step**: Users must "Lock" a university to proceed to the application phase.
- **Stage-Gate Logic**: The platform restricts access to specialized tools (like the SOP drafter) until a commitment is made, ensuring focus and momentum.

### 📊 4. Mission Control Dashboard
- **4-Stage Roadmap**: Visual tracking of your journey (Profile → Discovery → Finalizing → Application).
- **Profile Strength**: Real-time calculation of your "Precision Score" to identify gaps in your academic profile.

### 📄 5. AI Document Vault
- **Auto-Generated SOPs**: AI drafts your Statement of Purpose based on your unique profile.
- **Export to PDF**: Refine your documents in a built-in workspace and export professional PDFs.

---

## 🛠️ Technical Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL |
| **AI/LLM** | Groq (Llama 3.3 70B), OpenAI Whisper (for STT Fallback) |
| **Vector DB** | Upstash Vector (RAG Implementation) |
| **Auth** | NextAuth.js (Google & Credentials) |
| **State Management** | Zustand |

---

## 📸 UI Aesthetics
- **WebGL Shaders**: LiquidChrome effects for a premium "SaaS" feel.
- **Bento Grids**: Modern, clean organization of data and stats.
- **Micro-interactions**: High-fidelity animations using Framer Motion.

---

## ⚡ Quick Start (Local)

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd ai-counsellor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (.env):**
   ```env
   DATABASE_URL=
   GROQ_API_KEY=
   UPSTASH_VECTOR_REST_URL=
   UPSTASH_VECTOR_REST_TOKEN=
   NEXTAUTH_SECRET=
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the dev server:**
   ```bash
   npm run dev
   ```

---

## 🎯 Our Vision
To democratize high-end education consulting. We believe every student deserves a mentor who understands their data, respects their goals, and drives them toward execution.

**Built for the AI Counsellor Hackathon.** 🚀

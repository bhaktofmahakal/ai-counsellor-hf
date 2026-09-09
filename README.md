# AI Counsellor 🎓

AI Counsellor is an intelligent, stage-based platform designed to guide students through their study-abroad journey. From initial profile building to university discovery and application preparation, the platform uses AI to provide personalized, actionable advice.

## 🚀 Live Demo
**[https://ai-counsellor-hf.vercel.app/](https://ai-counsellor-hf.vercel.app/)**

## ✨ Core Features

- **AI-Led Onboarding**: A natural language interview that builds your academic and financial profile without tedious forms.
- **Agentic Mission Control**: A stage-aware dashboard that tracks your progress through 4 key phases:
  1. Profile Building
  2. University Discovery
  3. Finalizing Choices
  4. Application Preparation
- **Intelligent Discovery**: RAG-driven university recommendations categorized into **Dream**, **Target**, and **Safe** schools based on your specific GPA and budget.
- **AI Counsellor (Voice & Call Mode)**: 
  - **Live Mode**: A hands-free, interruptible voice experience for natural conversation.
  - **Action-Oriented**: The AI can create tasks, shortlist universities, and draft documents directly from the chat.
- **Application Vault**: AI-generated Statement of Purpose (SOP) drafts with gap analysis to ensure high-impact submissions.
- **Task Management**: AI-generated to-do lists that adapt to your current application stage.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase/Vercel Postgres)
- **AI Engine**: Groq SDK (Llama 3.3 70B)
- **Vector Search**: Upstash Vector (RAG implementation)
- **Real-time Stats**: Upstash Redis
- **Voice/Audio**: ElevenLabs API & Browser Speech Synthesis

## 🏗️ Architecture

- **State Management**: Zustand with persistent storage for seamless navigation.
- **Authentication**: NextAuth.js for secure user sessions.
- **Agentic Logic**: A custom-built action parser that allows the LLM to trigger state changes in the UI (creating tasks, locking universities, etc.).
- **Voice Interruption**: Implemented using real-time speech recognition and audio context management to allow users to stop the AI mid-sentence.

## 📝 Usage

1. **Sign Up**: Create an account and start the AI onboarding.
2. **Profile**: Tell the AI about your GPA, budget, and goals.
3. **Discover**: Browse universities matched to your profile.
4. **Lock**: Commit to your top choice to unlock Phase 4.
5. **Prepare**: Use the AI to draft your SOP and manage application tasks.

---

Built with ❤️ for the AI Counsellor Hackathon.

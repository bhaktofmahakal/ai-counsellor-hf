# AI Counsellor

AI Counsellor is a study‑abroad guidance platform that helps students move from profile setup to application prep through a structured, stage‑based workflow. This repository focuses on the product core: onboarding, discovery, shortlisting, locking, and task/document management.

## Product workflow
1. **Profile building** — collect academic background, goals, budget, and test readiness.
2. **University discovery** — search and match programs based on the profile.
3. **Shortlist & lock** — commit to a small set of target universities.
4. **Application prep** — generate actionable tasks and manage documents.

## Core capabilities
- **Stage-based guidance** with gating logic for shortlisting and locking.
- **AI counsellor chat** with persona modes and stage‑aware responses.
- **Semantic university discovery** powered by embeddings + vector search.
- **Shortlist management** and university locking to drive focus.
- **Task management** with per‑stage tasks and progress tracking.
- **Document workspace** for creating, uploading, editing, and exporting SOPs/Resumes.
- **Optional voice mode** (browser speech + ElevenLabs TTS when configured).

## Data sources & accuracy
- University data is stored in PostgreSQL and can be seeded into the database.
- External lookups use the public **Hipolabs Universities API** for basic metadata.
- Semantic matching uses **Hugging Face embeddings** with **Upstash Vector**.
- **Accuracy is not guaranteed.** Tuition, rankings, acceptance rates, and deadlines should be verified with official sources.

## AI & automation
- **LLM**: Groq via `groq-sdk` (configured with `GROQ_API_KEY`).
- **Onboarding interview**: AI collects profile details in a structured flow.
- **Stage-aware prompts**: The model adapts guidance based on the user’s current stage and locked universities.

## Security & privacy (implementation notes)
- **Auth**: NextAuth with Google OAuth and credentials.
- **Passwords**: hashed with `bcryptjs`.
- **Data**: stored in PostgreSQL via Prisma.

This repo does not make compliance claims (SOC 2, GDPR, FERPA, etc.). Review and extend security controls before deploying to production environments handling sensitive data.

## Tech stack
- **Web**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn-style components, Framer Motion
- **Data**: PostgreSQL, Prisma ORM
- **AI**: Groq Llama 3.3, Hugging Face embeddings
- **Vector/Cache**: Upstash Vector, Upstash Redis
- **Auth**: NextAuth

## Local development
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment variables
   ```bash
   cp .env.example .env
   ```
3. Initialize the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Run the dev server
   ```bash
   npm run dev
   ```

## Deployment notes
- This project expects valid API keys for Groq, Hugging Face, Upstash, and (optionally) ElevenLabs.
- External network access is required for Google Fonts in Next.js builds by default.

---

If you’re evaluating the platform for production use, start by validating data sources and aligning the workflow with your institution’s policies and guidance standards.

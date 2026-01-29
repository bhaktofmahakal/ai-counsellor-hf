# **AI Counsellor - Hackathon**

## 🚀 **Project Overview:**

**AI Counsellor** is a guided, stage-based platform designed to help students make confident and informed study-abroad decisions. Instead of overwhelming users with listings or generic chat responses, the platform uses a structured **AI Counsellor** that deeply understands a student’s academic background, goals, budget, and readiness, and then guides them step by step from profile building to university shortlisting and application preparation. The AI Counsellor does not simply answer questions; it actively reasons, recommends, explains risks, shortlists universities, locks decisions, and creates actionable tasks based on the user’s current stage. This is not a chatbot or a browsing platform it is a decision and execution system built to remove confusion and provide clarity, direction, and momentum throughout the admission journey.

---

## 🎯 **What You Need to Do**

Your task is to **design and build a functional prototype of *AI Counsellor*** that demonstrates how a student is guided **step by step** from confusion to clarity in their study-abroad journey.

You are **not expected to build a complete or production-ready system**.

You are expected to build a **working, logical, and realistic functional prototype**.

### 1️⃣ Build the Core User Flow

Implement the complete, locked flow below:

- Landing Page → Signup / Login
- Mandatory Onboarding (Form or AI-led)
- Dashboard with stage indicators
- AI Counsellor interaction
- University discovery and shortlisting
- University locking (commitment stage)
- Application guidance with actionable to-dos

Each step must logically unlock the next.

---

### 2️⃣ Implement Structured Onboarding

Create an onboarding experience that:

- Collects academic background, study goals, budget, and exam readiness
- Can be completed manually or through an AI-led interaction (voice optional)
- Blocks access to the AI Counsellor until onboarding is completed

This data must power **all future recommendations**.

---

### 3️⃣ Build the AI Counsellor (Core Requirement)

Implement an **AI Counsellor** that:

- Understands the user’s profile and current stage
- Explains profile strengths and gaps
- Recommends universities (Dream / Target / Safe)
- Clearly explains *why* a university fits or is risky
- Can **take actions**, such as:
    - Shortlisting universities
    - Locking a university
    - Creating and updating to-do tasks

The AI Counsellor should **guide decisions**, not just answer questions.

---

### 4️⃣ Implement University Discovery & Logic

Create a university discovery system that:

- Uses researched, free, or dummy university data
- Filters universities based on:
    - User profile
    - Budget
    - Country preference
- Shows cost, risk level, and acceptance likelihood (simplified logic is fine)

Perfection is not required—**logical reasoning is**.

---

### 5️⃣ Enforce University Locking

Introduce a clear **commitment step**:

- Require the user to lock at least one university
- Prevent application guidance until a university is locked
- Allow unlocking later with a clear warning

This step is critical to show **focus and decision discipline**.

---

### 6️⃣ Add Application Guidance & To-Dos

After a university is locked:

- Show required documents and timelines
- Generate AI-driven to-do items (SOP, exams, forms, etc.)
- Allow tasks to be marked complete and auto-updated

No real submissions are required—**guidance and structure are the goal**.

---

### 7️⃣ Keep It Simple, Working, and Clear

- Prioritize **end-to-end working flows** over advanced features
- Avoid templates with broken logic
- Focus on clarity, usability, and decision guidance

> A simple product that works correctly will always beat a complex one that doesn’t.
> 

---

- EXPANDED CORE FLOW FOR BETTER CLARITY
    
    ## 🧭 **CORE PROTOTYPE FLOW**
    
    This prototype follows a **strict, step-by-step flow**.
    
    Nothing happens randomly.
    
    Each stage unlocks the next.
    
    ### **High-Level Flow**
    
    1. Landing Page
    2. Signup / Login
    3. Mandatory Onboarding
    4. Dashboard
    5. AI Counsellor
    6. University Shortlisting
    7. University Locking
    8. To-Do & Guidance View
    
    ---
    
    ## 🖥️ **1. LANDING PAGE**
    
    ### Purpose
    
    Explain the product in one glance and encourage the user to begin.
    
    ### Must Include
    
    - Product name and logo
    - Headline:
        
        > “Plan your study-abroad journey with a guided AI counsellor.”
        > 
    - Short description (1–2 lines)
    - CTA buttons:
        - **Get Started**
        - **Login**
    
    Keep the page minimal and distraction-free.
    
    ---
    
    ## 🔐 **2. AUTHENTICATION**
    
    ### Signup
    
    - Full Name
    - Email
    - Password
    - Google signup (optional)
    
    After signup → onboarding must start immediately.
    
    ### Login
    
    - Email + password
    - Forgot password (basic functionality is sufficient)
    
    ---
    
    ## 🧠 **3. USER ONBOARDING (MANDATORY)**
    
    ### Purpose
    
    Collect the **minimum required information** to understand the student’s background, goals, and readiness.
    
    Onboarding can be completed in **two modes**:
    
    - Step-by-step manual form
    - (Optional bonus) AI-led question flow, where the **AI Counsellor asks questions** (voice-based experience similar to conversational AI)
    
    Both modes must collect the **same underlying data**.
    
    ---
    
    ### Onboarding Sections (Simplified)
    
    ### A. Academic Background
    
    - Current education level
    - Degree / major
    - Graduation year
    - GPA or percentage (optional)
    
    ### B. Study Goal
    
    - Intended degree (Bachelor’s / Master’s / MBA / PhD)
    - Field of study
    - Target intake year
    - Preferred countries
    
    ### C. Budget
    
    - Budget range per year
    - Funding plan:
        - Self-funded
        - Scholarship-dependent
        - Loan-dependent
    
    ### D. Exams & Readiness
    
    - IELTS / TOEFL status
    - GRE / GMAT status
    - SOP status (Not started / Draft / Ready)
    
    ---
    
    ### Completion Gate
    
    - If onboarding is completed:
        - Profile is marked **Complete**
        - AI Counsellor unlocks
        - Dashboard becomes fully accessible
    - If onboarding is incomplete:
        - AI Counsellor remains locked
        - User is prompted to complete onboarding
    
    ---
    
    ## 📊 **4. DASHBOARD (CONTROL CENTER)**
    
    The dashboard answers **only three questions**:
    
    1. Where am I right now?
    2. What should I do next?
    3. How strong is my profile?
    
    ---
    
    ### Dashboard Sections
    
    ### A. Profile Summary
    
    - Education
    - Target intake
    - Countries
    - Budget
    
    ### B. Profile Strength (AI-Generated)
    
    - Academics: Strong / Average / Weak
    - Exams: Not started / In progress / Completed
    - SOP: Not started / Draft / Ready
    
    ### C. Current Stage Indicator
    
    - Stage 1: Building Profile
    - Stage 2: Discovering Universities
    - Stage 3: Finalizing Universities
    - Stage 4: Preparing Applications
    
    ### D. AI To-Do List
    
    - Auto-generated tasks
    - Tasks can be marked as completed
    - Tasks update automatically when profile or stage changes
    
    ---
    
    ## 🤖 **5. AI COUNSELLOR (CORE FEATURE)**
    
    ### What It Is
    
    The AI Counsellor is a persistent AI agent that understands:
    
    - The user’s profile
    - The current stage
    - Shortlisted and locked universities
    
    It is available via:
    
    - Chat interface
    - (Optional) Voice interface
    
    ---
    
    ### What the AI Counsellor Can Do
    
    - Explain the user’s profile strengths and gaps
    - Recommend universities categorized as:
        - Dream
        - Target
        - Safe
    - Clearly explain:
        - Why a university fits
        - Where the risks are
    - Shortlist universities directly from the conversation
    - Add and update tasks in the to-do list
    - Suggest next steps based on the current stage
    - Perform key actions within the platform
    
    The AI Counsellor **must take actions**, not just respond with text.
    
    ---
    
    ## 🎓 **6. UNIVERSITY SHORTLISTING FLOW**
    
    ### Step 1: AI Recommendations
    
    Universities are suggested based on:
    
    - User profile
    - Budget
    - Country preferences
    - Competition level
    
    Grouped as:
    
    - Dream
    - Target
    - Safe
    
    (Dummy or research-based university data is acceptable.)
    
    ---
    
    ### Step 2: University Evaluation
    
    Each university should display:
    
    - Why it fits the user’s profile
    - Key risks
    - Cost level (Low / Medium / High)
    - Acceptance chance (Low / Medium / High)
    
    ---
    
    ### Step 3: University Locking (CRITICAL)
    
    - User must lock **at least one university**
    - Once locked:
        - Strategy becomes university-specific
        - Application guidance unlocks
    - User may unlock later with a clear warning
    
    ---
    
    ## ✅ **7. APPLICATION GUIDANCE (SIMPLIFIED)**
    
    Unlocked **only after university locking**.
    
    Display:
    
    - Required documents
    - High-level timeline
    - AI-generated tasks:
        - SOP
        - Exams
        - Forms
    
    No real submissions are required.
    
    ---
    
    ## 🛠️ **8. PROFILE MANAGEMENT**
    
    - Fully editable profile page
    - Any profile edit triggers:
        - Recalculation of university recommendations
        - Task updates
        - Acceptance chance updates
    
    The AI Counsellor must always operate on the **latest profile state**.
    
    ---
    

---

## 🧰 **Tech Expectations**

- **Frontend**: React or Next.js with responsive design for different screen sizes
- **Backend**: FastAPI (Python) or Node.js
- **Database**: PostgreSQL must be scalable, reliable, and well-structured
- **APIs**: Do respective research on university api or any free api that can work for assignment
- **APIs:** Conduct relevant research on university APIs or any free APIs that can be used for this assignment.
- **AI Usage:** Teams may use **Gemini** or any other suitable AI model to power the AI counselor and related logic for this assignment.

---

## 📝 **Points to Note**

1. **UI/UX**: Clean, intuitive, and user-friendly design. Keep the flow smooth and simple.
2. **Code Quality**: Follow best practices and maintain well-structured code.
3. **Deployment**: Submit the deployment link and demo video.
4. **Code Submission**: You are N**ot Required to submit your code**. Winners will continue development as part of the founding team under expert guidance. This challenge focuses on Skills, **AI leverage and creativity**.
5. **Use of AI Tools**: Set up Cursor or similar tools to improve productivity and speed act smartly.
6. **Discipline**: We are strict about **discipline** and behavior, so make sure to consider this. Those who stay committed, consistent, and respectful until the end will receive a certificate in recognition of their efforts.

---

## 📤 **Submission Instructions**

1. **Demo Video**: 3–5 minutes showcasing the MVP and UI/UX.
2. **Deployment Link**: Submit a working deployment link for review.
3. Join the Telegram group for submissions: https://t.me/+Q8YDJotNBThmNzk1
4. **Submission Deadline: Saturday, 12:00 PM**

---

## 🏆 **Evaluation Criteria**

1. **Product clarity** – did you understand the problem?
2. **Flow correctness** – strict stage-based behavior
3. **AI usefulness** – actions, not fluff
4. **UX clarity** – can a unknow person actually use this?
5. **Execution discipline** – working > fancy (Avoid keeping template)

---

## 🏆 **Prizes and Opportunities**

- 🥇 **Hackathon Winner**:
    - The most functional and user-friendly platform creator will receive a **full-time job offer** as a **founding member with a high CTC**.
- 🎖️ **Certificates**:
    - Participants with functional MVPs, even if not winners, will receive **certificates of appreciation** if their submissions are liked by the founders.

## 🌟 Closing Note

This hackathon is more than a challenge it’s a chance to **shape your future** while working on one of the most **advanced projects** out there.

It’s a test for your **dedication and obsession** towards your role not just how much you know, but how much you’re willing to figure out.

It’s a **test of skills over resumes** in the era of AI, you’re **completely free to use any AI tool** to do this assignment. What matters is how smartly you use it and how much ownership you show.

We want to work with **people who enjoy challenges**, the ones who keep pushing even when things break, and **don’t stop until it finally works.**

Once you’re onboard, you’ll be working with a **team of geniuses** and on some seriously exciting stuff. But before that, you’ve got to **prove you’re the right fit** for this role.

So yeah thank you for being here, and all the very best for this Hackathon!!

We’re looking forward to connecting/working with the person who can ultimately get recognized as an winner of this challenge.
Also, to those who stay till the end and give it their best shot but ultimately don’t end up winning, we’ll be giving a **Certificate of Appreciation** for their **hard work, consistency, determination, and dedication. Cheers and ALL THE BEST!!!** 😉🔥.

import { prisma } from './prisma';
import { calculateProfileStrength } from './utils/profile';

const STAGE_DEFAULT_TASKS: Record<number, { title: string, priority: string, dueOffset: number }[]> = {
    1: [
        { title: 'Complete your profile details', priority: 'high', dueOffset: 2 },
    ],
    2: [
        { title: 'Explore top 5 recommended universities', priority: 'high', dueOffset: 5 },
        { title: 'Compare tuition fees for your budget', priority: 'medium', dueOffset: 7 },
    ],
    3: [
        { title: 'Finalize selection for shortlisted universities', priority: 'critical', dueOffset: 3 },
        { title: 'Contact alumni from target universities', priority: 'low', dueOffset: 10 },
    ],
    4: [
        { title: 'Draft your Statement of Purpose (SOP)', priority: 'high', dueOffset: 14 },
        { title: 'Request Letters of Recommendation (LOR)', priority: 'high', dueOffset: 20 },
        { title: 'Book IELTS/TOEFL exam slot', priority: 'critical', dueOffset: 10 },
    ],
};

export async function syncStageTasks(userId: string, stage: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tasks: true }
        });

        if (!user) return;

        // --- NEW: Stage Consistency & Auto-Completion Logic ---

        // 1. Mark tasks from PREVIOUS stages as completed ONLY if they are actually done
        // OR if the user is 2+ stages ahead.
        const strength = calculateProfileStrength(user);

        await prisma.task.updateMany({
            where: {
                userId,
                stage: { lt: stage },
                completed: false,
                OR: [
                    { title: { contains: 'profile', mode: 'insensitive' } },
                    { title: { contains: 'details', mode: 'insensitive' } }
                ]
            },
            data: { completed: strength >= 80 }
        });

        // 2. Mark ALL tasks from PREVIOUS stages as completed
        await prisma.task.updateMany({
            where: {
                userId,
                stage: { lt: stage },
                completed: false,
            },
            data: { completed: true }
        });

        // 2. Remove any tasks for "Phase 5, 6, 7" or containing placeholders
        await prisma.task.deleteMany({
            where: {
                userId,
                OR: [
                    { stage: { gt: 4 } },
                    { title: { contains: 'UNIVERSITY_ID' } },
                    { title: { contains: '[ID]' } }
                ]
            }
        });

        // ------------------------------------------------------

        const tasks = STAGE_DEFAULT_TASKS[stage] || [];

        // Specialized Tasks for Locked University
        if (stage === 4 && user.lockedUniversityId) {
            const university = await prisma.university.findUnique({
                where: { id: user.lockedUniversityId }
            });

            if (university) {
                const uniName = university.name;
                const specializedTasks = [
                    { title: `Complete Application Form for ${uniName}`, priority: 'critical', dueOffset: 7 },
                    { title: `Upload Portfolio/Work Experience for ${uniName}`, priority: 'medium', dueOffset: 15 },
                    { title: `Pay Application Fee for ${uniName}`, priority: 'high', dueOffset: 20 },
                ];

                // Add specialized tasks if they don't exist
                for (const st of specializedTasks) {
                    if (!user.tasks.some((t: any) => t.title === st.title)) {
                        tasks.push(st);
                    }
                }

                // Auto-generate SOP Draft if it doesn't exist
                const existingSOP = await prisma.document.findFirst({
                    where: { userId, type: 'SOP', title: { contains: uniName } }
                });

                if (!existingSOP) {
                    await prisma.document.create({
                        data: {
                            userId,
                            title: `SOP for ${uniName}`,
                            type: 'SOP',
                            content: `Dear Admissions Committee at ${uniName},\n\nI am writing to express my strong interest in the program at ${uniName}. With my background in ${user.degree || 'my field'} and a GPA of ${user.gpa || 'N/A'}, I believe I am a strong candidate...\n\n[This is an AI-generated draft based on your profile. Please edit this in the Documents section to add your personal achievements.]`,
                            status: 'draft'
                        }
                    });
                }
            }
        }

        if (tasks.length === 0) return;

        // Check existing tasks to avoid duplicates - fetch fresh data from DB
        const freshTasks = await prisma.task.findMany({ where: { userId, stage } });
        const existingTitles = freshTasks.map((t: any) => t.title);

        const newTasks = tasks
            .filter(t => !existingTitles.includes(t.title))
            .map(t => {
                const due = new Date();
                due.setDate(due.getDate() + t.dueOffset);
                return {
                    userId,
                    title: t.title,
                    priority: t.priority,
                    stage,
                    completed: false,
                    due: due.toISOString()
                };
            });

        if (newTasks.length > 0) {
            await prisma.task.createMany({
                data: newTasks
            });
        }
    } catch (error) {
        console.error('Error syncing stage tasks:', error);
    }
}

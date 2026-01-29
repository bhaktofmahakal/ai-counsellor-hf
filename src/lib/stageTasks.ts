
import { prisma } from './prisma';

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
        const tasks = STAGE_DEFAULT_TASKS[stage] || [];
        if (tasks.length === 0) return;

        // Check existing tasks to avoid duplicates
        const existingTitles = (await prisma.task.findMany({
            where: { userId, stage },
            select: { title: true }
        })).map(t => t.title);

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
                    due: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

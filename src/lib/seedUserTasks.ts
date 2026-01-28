import { prisma } from './prisma';

const formatDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const INITIAL_TASKS_TEMPLATE = [
  { title: 'Complete your profile', priority: 'high', due: formatDate(0), stage: 1 },
  { title: 'Upload transcript draft', priority: 'medium', due: formatDate(1), stage: 1 },
  { title: 'Explore university options', priority: 'high', due: formatDate(3), stage: 2 },
  { title: 'Shortlist 3 universities', priority: 'high', due: formatDate(7), stage: 2 },
  { title: 'Lock a university', priority: 'critical', due: formatDate(14), stage: 3 },
  { title: 'Draft Statement of Purpose (SOP)', priority: 'high', due: formatDate(21), stage: 4 },
  { title: 'Request Letter of Recommendations (3)', priority: 'medium', due: formatDate(25), stage: 4 },
  { title: 'Prepare Financial Affidavit', priority: 'medium', due: formatDate(30), stage: 4 },
  { title: 'Verify Passport Validity', priority: 'low', due: formatDate(35), stage: 4 },
  { title: 'Book English Proficiency Exam (IELTS/TOEFL)', priority: 'critical', due: formatDate(10), stage: 4 },
  { title: 'Review University-Specific Essay Prompt', priority: 'high', due: formatDate(28), stage: 4 },
];

export async function seedUserTasks(userId: string) {
  try {
    const tasks = await prisma.task.createMany({
      data: INITIAL_TASKS_TEMPLATE.map(task => ({
        ...task,
        userId,
        completed: false,
      })),
    });
    return tasks;
  } catch (error) {
    console.error('Error seeding user tasks:', error);
    throw error;
  }
}

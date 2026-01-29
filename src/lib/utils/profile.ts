export type ProfileCompletionItem = {
    label: string;
    completed: boolean;
};

export const getProfileCompletionItems = (user: any): ProfileCompletionItem[] => {
    return [
        {
            label: 'Basic Information',
            completed: !!user.name && !!user.email
        },
        {
            label: 'Academic Background',
            completed: !!user.education && !!user.degree && !!user.gpa
        },
        {
            label: 'Study Goals',
            completed: !!user.studyGoal && (!!user.targetField || !!user.degree) && !!user.targetIntake
        },
        {
            label: 'Budget Planning',
            completed: (user.budgetMax || 0) > 0 && !!user.fundingPlan
        },
        {
            label: 'Readiness (Exam/SOP)',
            completed: !!user.examStatus && (user.examStatus === 'completed' ? !!user.examScores : true) && !!user.sopStatus
        },
    ];
};

export const calculateProfileStrength = (user: any): number => {
    const items = getProfileCompletionItems(user);
    const completedCount = items.filter(item => item.completed).length;
    if (items.length === 0) return 0;
    return Math.round((completedCount / items.length) * 100);
};

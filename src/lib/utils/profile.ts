export type ProfileCompletionItem = {
    label: string;
    completed: boolean;
};

const isValueCompleted = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    const s = String(val).toLowerCase().trim();
    if (s === '' || s === 'null' || s === 'undefined') return false;
    
    const incompleteValues = [
        'not specified', 
        'not specified',
        'not-specified',
        'not started', 
        'not-started',
        'not drafted', 
        'not-drafted',
        'select intake', 
        'select-intake',
        'select funding',
        'select-funding',
        'planning',
        'unknown',
        'n/a',
        'null',
        'undefined',
        ''
    ];
    return !incompleteValues.includes(s);
};

export const getProfileCompletionItems = (user: any): ProfileCompletionItem[] => {
    return [
        {
            label: 'Basic Information',
            completed: isValueCompleted(user.name) && isValueCompleted(user.email)
        },
        {
            label: 'Academic Background',
            completed: isValueCompleted(user.education) && isValueCompleted(user.degree) && isValueCompleted(user.gpa)
        },
        {
            label: 'Study Goals',
            completed: isValueCompleted(user.studyGoal) && (isValueCompleted(user.targetField) || isValueCompleted(user.degree)) && isValueCompleted(user.targetIntake)
        },
        {
            label: 'Budget Planning',
            completed: (user.budgetMax || 0) > 0 && isValueCompleted(user.fundingPlan)
        },
        {
            label: 'Preferred Countries',
            completed: Array.isArray(user.preferredCountries) ? user.preferredCountries.length > 0 : isValueCompleted(user.preferredCountries)
        },
        {
            label: 'Readiness (Exam/SOP)',
            completed: isValueCompleted(user.examStatus) && 
                      (String(user.examStatus).toLowerCase() === 'completed' ? isValueCompleted(user.examScores) : true) && 
                      isValueCompleted(user.sopStatus) &&
                      !String(user.sopStatus).toLowerCase().includes('not started') &&
                      !String(user.sopStatus).toLowerCase().includes('not drafted')
        },
    ];
};

export const calculateProfileStrength = (user: any): number => {
    const items = getProfileCompletionItems(user);
    const completedCount = items.filter(item => item.completed).length;
    if (items.length === 0) return 0;
    return Math.round((completedCount / items.length) * 100);
};

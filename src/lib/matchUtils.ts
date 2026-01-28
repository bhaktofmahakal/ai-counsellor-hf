export type MatchCategory = 'Dream' | 'Target' | 'Safe';

export function getMatchCategory(score: number): MatchCategory {
    if (score >= 80) return 'Safe';
    if (score >= 60) return 'Target';
    return 'Dream';
}

export function getCategoryStyles(category: MatchCategory): string {
    switch (category) {
        case 'Safe':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'Target':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'Dream':
            return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
        default:
            return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
}

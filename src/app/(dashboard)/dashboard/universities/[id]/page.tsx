'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/lightswind/card';
import { Badge } from '@/components/lightswind/badge';
import { Button } from '@/components/lightswind/button';
import { useAppStore } from '@/lib/store';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import {
    GraduationCap,
    MapPin,
    DollarSign,
    TrendingUp,
    Star,
    Sparkles,
    CheckCircle2,
    ShieldAlert,
    Clock,
    ArrowLeft,
    Bookmark
} from 'lucide-react';
import { toast } from 'sonner';

export default function UniversityDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { universities, shortlistedIds, toggleShortlist, user, setUniversities, lockedUniversityId } = useAppStore();
    const [university, setUniversity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState<string>("");
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const uni = universities.find(u => u.id === id);
        if (uni) {
            setUniversity(uni);
            setLoading(false);
        } else {
            // Fetch if not found in store
            fetch(`/api/universities?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    setUniversity(data);
                    // Add to global store so other pages can see it (e.g. shortlist)
                    if (data && !Array.isArray(data)) {
                        setUniversities([...universities, data]);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id, universities, setUniversities]);

    const handleShortlistToggle = () => {
        const uniToToggle = university;
        toggleShortlist(uniToToggle.id);
        const isCurrentlyShortlisted = shortlistedIds.includes(uniToToggle.id);

        fetch('/api/shortlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                universityId: uniToToggle.id,
                universityData: uniToToggle.id.startsWith('ext-') ? uniToToggle : undefined
            }),
        });

        toast.success(isCurrentlyShortlisted ? 'Removed from shortlist' : 'Added to shortlist');
    };

    const runAiAnalysis = async () => {
        setAnalyzing(true);
        try {
            const response = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Please provide a professional, VERY CONCISE (strictly 7-10 lines) feasibility analysis for my application to ${university.name}. 
                    
                    USER PROFILE:
                    - GPA: ${user.gpa} (Scale: ${user.gpaScale || '10.0'})
                    - Target Goal: ${user.studyGoal}
                    - Preferred Countries: ${user.preferredCountries?.join(', ') || 'Global'}
                    
                    UNIVERSITY INFO:
                    - Name: ${university.name}
                    - Rank: #${university.rank}
                    - Tuition: $${university.tuition}
                    
                    IMPORTANT: 
                    - Use STRICT Markdown formatting. 
                    - Use bullet points for every section.
                    - Total length must be between 7 to 10 lines.
                    - Use bold **text** for emphasis.
                    - DO NOT include an introduction or conclusion.
                    
                    Structure:
                    # ${university.name} Analysis
                    - **Verdict**: [Reach/Match/Safe] - [1 sentence reason]
                    - **Academic**: [Concise check of GPA ${user.gpa} vs standards]
                    - **Financial**: [Concise tuition feasibility]
                    - **Risk**: [Identify one major blocker]
                    - **Tip**: [One high-impact actionable tip]`,
                    userProfile: user,
                    currentStage: 3
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();
            if (data.response) {
                setAiAnalysis(data.response);
            } else {
                throw new Error('No analysis generated');
            }
        } catch (error: any) {
            console.error('AI Analysis Error:', error);
            toast.error(error.message || 'AI Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-400">Loading university details...</div>;
    if (!university) return <div className="p-12 text-center text-white">University not found</div>;

    const isShortlisted = shortlistedIds.includes(university.id);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Discovery
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20">
                            {university.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge className="bg-yellow-500 text-slate-900 border-none">TOP RANKED</Badge>
                                {university.tags.map((tag: string) => (
                                    <Badge key={tag} className="bg-white/10 text-slate-300 border-white/10">{tag}</Badge>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-black text-white">{university.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-slate-400">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="font-medium">{university.location}, {university.country}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button
                        onClick={handleShortlistToggle}
                        variant={isShortlisted ? "ghost" : "outline"}
                        className={`${isShortlisted ? "text-red-400 border-red-500/20" : "border-white/10 text-white"} w-full sm:w-auto`}
                    >
                        <Bookmark className={`w-4 h-4 mr-2 ${isShortlisted ? 'fill-current' : ''}`} />
                        {isShortlisted ? 'Remove Shortlist' : 'Shortlist University'}
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/shortlist')}
                        className={`w-full sm:w-auto ${lockedUniversityId === university.id
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold"
                            : "bg-white text-black font-bold"}`}
                    >
                        {lockedUniversityId === university.id ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Locked for Application
                            </span>
                        ) : 'Lock for Application'}
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 bg-slate-900/60 border-white/10 space-y-6">
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs border-b border-white/5 pb-4">Key Metrics</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm text-slate-300">Global Rank</span>
                                </div>
                                <span className="font-bold text-white">#{university.rank || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-slate-300">Annual Tuition</span>
                                </div>
                                <span className="font-bold text-white">${university.tuition?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-slate-300">Acceptance Rate</span>
                                </div>
                                <span className="font-bold text-white">{university.acceptanceRate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-red-400" />
                                    <span className="text-sm text-slate-300">Intake</span>
                                </div>
                                <span className="font-bold text-white">Fall/Spring</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-indigo-600/20 to-transparent border-white/5 space-y-4">
                        <h3 className="font-bold text-white text-sm">AI Match Score</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black text-white">{university.matchScore}%</span>
                            <span className="text-emerald-400 text-xs font-bold mb-2 tracking-widest">EXCELLENT FIT</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                style={{ width: `${university.matchScore}%` }}
                            />
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* AI Analysis Tab */}
                    <Card className="p-8 bg-slate-900/40 backdrop-blur-3xl border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-600/20">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white leading-none">AI Feasibility Analysis</h3>
                                        <p className="text-slate-400 text-sm mt-1">Personalized admissions analysis powered by AI</p>
                                    </div>
                                </div>
                                {!aiAnalysis && (
                                    <Button
                                        onClick={runAiAnalysis}
                                        disabled={analyzing}
                                        className="bg-white text-black font-bold h-12 px-6 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        {analyzing ? 'Analyzing Stats...' : 'Run Analysis'}
                                    </Button>
                                )}
                            </div>

                            {aiAnalysis ? (
                                <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 prose prose-invert max-w-none text-slate-300 leading-relaxed font-medium">
                                    <MarkdownRenderer content={aiAnalysis} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Strengths</h4>
                                        <p className="text-[10px] text-slate-500">{university.strengths?.join(', ') || 'AI will analyze your profile strengths for this university.'}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Challenges</h4>
                                        <p className="text-[10px] text-slate-500">{university.risks?.join(', ') || 'AI will identify potential blockers in your application.'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* About Section */}
                    <Card className="p-8 bg-slate-900/40 border-white/5 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-widest text-xs text-slate-500">About the University</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {university.description}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div>
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-indigo-400" />
                                    Popular Programs
                                </h4>
                                <ul className="space-y-2">
                                    {university.programs?.map((p: string) => (
                                        <li key={p} className="text-slate-400 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                                    Admissions Odds
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Your Profile Fit</span>
                                            <span className="text-white font-bold">{university.matchScore}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${university.matchScore}%` }} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">
                                        Based on your GPA ({user.gpa}) and target intake.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

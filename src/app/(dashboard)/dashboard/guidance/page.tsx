"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/lightswind/button";
import { Card } from "@/components/lightswind/card";
import {
    CheckCircle2,
    Circle,
    Sparkles,
    TrendingUp,
    FileText,
    MessageSquare,
    ArrowLeft,
    X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface GuidanceTask {
    id: string;
    title: string;
    category: "Admin" | "Documents" | "Essay";
    completed: boolean;
    hasAIReview?: boolean;
}

interface LockedUniversity {
    id: string;
    name: string;
    location: string;
    country: string;
}

export default function GuidancePage() {
    const router = useRouter();
    const { user } = useAppStore();
    const [lockedUniversity, setLockedUniversity] = useState<LockedUniversity | null>(null);
    const [tasks, setTasks] = useState<GuidanceTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMockInterview, setShowMockInterview] = useState(false);
    const [showContentReview, setShowContentReview] = useState(false);
    const [selectedTask, setSelectedTask] = useState<GuidanceTask | null>(null);

    // AI Mock Interview State
    const [interviewMessages, setInterviewMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [interviewInput, setInterviewInput] = useState("");
    const [isInterviewLoading, setIsInterviewLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // AI Content Review State
    const [essayContent, setEssayContent] = useState("");
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewResult, setReviewResult] = useState<{
        score: number;
        verdict: string;
        feedback: string;
        improvements: string[];
    } | null>(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [interviewMessages, showMockInterview]);

    // Handlers
    const handleSendMessage = async (content: string) => {
        if (!content.trim() || !lockedUniversity) return;

        const newMessage = { role: 'user' as const, content };
        setInterviewMessages(prev => [...prev, newMessage]);
        setInterviewInput("");
        setIsInterviewLoading(true);

        try {
            const apiMessages = [...interviewMessages, newMessage].map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    universityName: lockedUniversity.name
                })
            });

            const data = await res.json();

            if (data.message) {
                setInterviewMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to get response");
        } finally {
            setIsInterviewLoading(false);
        }
    };

    const handleTitleReview = async () => {
        if (!essayContent.trim() || !lockedUniversity) return;

        setIsReviewLoading(true);
        try {
            const res = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: essayContent,
                    type: selectedTask?.category === 'Essay' ? 'Essay' : 'Statement of Purpose',
                    universityName: lockedUniversity.name
                })
            });

            const data = await res.json();

            if (data.score !== undefined) {
                setReviewResult(data);
                toast.success("Analysis Complete!");
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error('Error reviewing content:', error);
            toast.error("Failed to analyze content");
        } finally {
            setIsReviewLoading(false);
        }
    };

    useEffect(() => {
        fetchGuidance();
    }, []);

    const fetchGuidance = async () => {
        try {
            const res = await fetch("/api/guidance");
            const data = await res.json();

            if (!data.lockedUniversity) {
                setLockedUniversity(null);
            } else {
                setLockedUniversity(data.lockedUniversity);
                setTasks(data.tasks || []);
            }
        } catch (error) {
            console.error("Error fetching guidance:", error);
            toast.error("Failed to load guidance");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (taskId: string) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;

            const res = await fetch(`/api/guidance/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !task.completed }),
            });

            if (!res.ok) throw new Error("Failed to update task");

            setTasks(
                tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
            );
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        }
    };

    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    // Locked State
    if (!lockedUniversity) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex items-center justify-center">
                <Card className="p-12 text-center bg-white/5 border-white/10 max-w-2xl">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                        Application Guidance Locked
                    </h3>
                    <p className="text-slate-400 mb-6">
                        You must Lock a University in your Shortlist to unlock Application Guidance
                    </p>
                    <Button
                        onClick={() => router.push("/dashboard/shortlist")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                    >
                        Go to Shortlist
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={() => router.push("/dashboard/shortlist")}
                        variant="ghost"
                        className="text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shortlist
                    </Button>
                    <h1 className="text-4xl font-bold text-white mb-2">Application Guidance</h1>
                    <p className="text-slate-400">
                        Step-by-step tasks to complete your application for {lockedUniversity.name}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-400 font-medium uppercase tracking-widest">
                            Phase 4: Application Guidance
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress */}
                        <Card className="p-6 bg-white/5 border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                                <span className="text-2xl font-bold text-yellow-500">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </Card>

                        {/* Tasks Checklist */}
                        <Card className="p-6 bg-white/5 border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                Tasks Checklist
                            </h3>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-lg hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => handleToggleTask(task.id)}
                                                className="flex-shrink-0"
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-500" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-medium ${task.completed ? "text-slate-500 line-through" : "text-white"
                                                        }`}
                                                >
                                                    {task.title}
                                                </p>
                                                <span className="text-xs text-slate-500">{task.category}</span>
                                            </div>
                                        </div>
                                        {task.hasAIReview && task.category === "Essay" && (
                                            <Button
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowContentReview(true);
                                                }}
                                                size="sm"
                                                className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20"
                                            >
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                AI Review
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Mock Interview & Ready to Submit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Mock Interview */}
                            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20 relative overflow-hidden">
                                <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                                    NEW
                                </div>
                                <MessageSquare className="w-10 h-10 text-purple-400 mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">Mock Interview</h4>
                                <p className="text-slate-400 text-sm mb-4">
                                    Practice university-specific questions with AI feedback.
                                </p>
                                <Button
                                    onClick={() => setShowMockInterview(true)}
                                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                >
                                    Start Session →
                                </Button>
                            </Card>

                            {/* Ready to Submit */}
                            <Card className="p-6 bg-white/5 border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white">Ready to Submit?</h4>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Tasks Completed</span>
                                        <span className="text-white font-medium">{progress}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Documents</span>
                                        <button
                                            onClick={() => router.push("/dashboard/profile")}
                                            className="text-blue-400 hover:underline"
                                        >
                                            Manage in Profile →
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    disabled={progress < 100}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Finalize Application
                                </Button>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Tips */}
                        <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-teal-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-white">AI Tips</h4>
                            </div>
                            <p className="text-slate-300 text-sm mb-4 italic">
                                "Make sure your Personal Statement highlights your leadership in the Robotics
                                Club. {lockedUniversity.name} values initiative."
                            </p>
                            <p className="text-xs text-teal-400 mb-3">Based on your Profile</p>
                            <Button
                                size="sm"
                                className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/30"
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate Essay Outline
                            </Button>
                        </Card>

                        {/* Standout Strategies */}
                        <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-violet-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-white">Standout Strategies</h4>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-1">•</span>
                                    <span>
                                        Enhance your resume with relevant internships or projects in computer
                                        science.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-1">•</span>
                                    <span>
                                        Prepare strong recommendation letters from professors who can vouch for
                                        your technical skills and potential.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-400 mt-1">•</span>
                                    <span>
                                        Craft a compelling personal statement that highlights your passion for
                                        computer science and how {lockedUniversity.name} aligns with your career
                                        goals.
                                    </span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mock Interview Modal */}
            {showMockInterview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-3xl w-full h-[600px] flex flex-col bg-slate-900 border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Mock Interview: {lockedUniversity.name}</h3>
                                    <p className="text-xs text-slate-400">AI Admissions Officer</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowMockInterview(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
                            {interviewMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                    <MessageSquare className="w-12 h-12 text-slate-500" />
                                    <p className="text-slate-400">Start the conversation to begin your interview.</p>
                                    <Button
                                        onClick={() => handleSendMessage("Hello, I'm ready for the interview.")}
                                        variant="outline"
                                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                    >
                                        Start Interview
                                    </Button>
                                </div>
                            ) : (
                                interviewMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white rounded-tr-sm'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {isInterviewLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-white/5">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-white/10 bg-slate-950">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(interviewInput);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={interviewInput}
                                    onChange={(e) => setInterviewInput(e.target.value)}
                                    placeholder="Type your answer..."
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <Button
                                    type="submit"
                                    disabled={!interviewInput.trim() || isInterviewLoading}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Send
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* Content Review Modal */}
            {showContentReview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-900 border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-teal-400" />
                                    AI Content Review
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Reviewing: <span className="text-white font-medium">{selectedTask?.title}</span>
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowContentReview(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!reviewResult ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Paste your content here</label>
                                        <textarea
                                            value={essayContent}
                                            onChange={(e) => setEssayContent(e.target.value)}
                                            placeholder="Paste your Statement of Purpose or Essay here..."
                                            className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-teal-500 transition-colors resize-none font-mono text-sm leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleTitleReview}
                                            disabled={!essayContent.trim() || isReviewLoading}
                                            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
                                        >
                                            {isReviewLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Analyze with AI
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Score Header */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 flex items-center gap-6 p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${reviewResult.score >= 90 ? 'border-emerald-500 text-emerald-400' :
                                                reviewResult.score >= 70 ? 'border-yellow-500 text-yellow-400' :
                                                    'border-red-500 text-red-400'
                                                }`}>
                                                {reviewResult.score}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white mb-1">AI Verdict</h4>
                                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${reviewResult.verdict.includes('Accept')
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {reviewResult.verdict.toUpperCase()}
                                                </div>
                                                <p className="text-sm text-slate-400">Match for {lockedUniversity.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="space-y-6">
                                        <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5">
                                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-400" />
                                                Analysis
                                            </h4>
                                            <p className="text-slate-300 leading-relaxed text-sm">
                                                {reviewResult.feedback}
                                            </p>
                                        </div>

                                        <div className="bg-teal-500/5 p-6 rounded-2xl border border-teal-500/10">
                                            <h4 className="font-bold text-teal-400 mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4" />
                                                Key Improvements Needed
                                            </h4>
                                            <ul className="space-y-3">
                                                {reviewResult.improvements.map((imp: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
                                                            {i + 1}
                                                        </span>
                                                        <span className="mt-1">{imp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-6 border-t border-white/10">
                                        <Button
                                            variant="outline"
                                            onClick={() => setReviewResult(null)}
                                            className="border-white/10 text-slate-400 hover:text-white"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Check Another Draft
                                        </Button>
                                        <Button className="bg-white text-slate-900 hover:bg-slate-200">
                                            Save Analysis
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

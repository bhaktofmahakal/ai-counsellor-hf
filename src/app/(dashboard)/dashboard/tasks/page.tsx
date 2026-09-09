'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { Button } from '@/components/lightswind/button';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  FileText,
  X,
  ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/lightswind/card';
import { Badge } from '@/components/lightswind/badge';
import { calculateProfileStrength } from '@/lib/utils/profile';

export default function TasksPage() {
  const { tasks, toggleTask, deleteTask, addTask, setTasks, currentStage, user, updateUser, lockedUniversityId } = useAppStore();
  const strength = calculateProfileStrength(user);

  // Locked University State
  const [lockedUniversity, setLockedUniversity] = useState<{ id: string; name: string; location: string; country: string } | null>(null);
  const [guidanceTasks, setGuidanceTasks] = useState<any[]>([]);

  // Mock Interview State
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [interviewMessages, setInterviewMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [interviewInput, setInterviewInput] = useState("");
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Content Review State
  const [showContentReview, setShowContentReview] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [essayContent, setEssayContent] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    verdict: string;
    feedback: string;
    improvements: string[];
  } | null>(null);

  // Add Task State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newTaskStage, setNewTaskStage] = useState(currentStage);

  // Fetch tasks and status on mount AND when university is locked
  useEffect(() => {
    const fetchLatestTasks = async () => {
      if (!user.id || !user.email) return;
      try {
        const [tasksRes, userRes] = await Promise.all([
          fetch(`/api/tasks?userId=${user.id}`),
          fetch(`/api/user?email=${user.email}`)
        ]);

        if (tasksRes.ok) {
          const latestTasks = await tasksRes.json();
          setTasks(latestTasks);
        }

        if (userRes.ok) {
          const latestUserData = await userRes.json();
          updateUser(latestUserData);
        }
      } catch (e) {
        console.error("Failed to sync tasks:", e);
      }
    };

    fetchLatestTasks();
  }, [user.id, user.email, lockedUniversityId]); // Added lockedUniversityId to refresh when university is locked

  // Fetch locked university and guidance tasks
  useEffect(() => {
    if (lockedUniversityId) {
      fetch('/api/guidance')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data.lockedUniversity) {
            setLockedUniversity(data.lockedUniversity);
            setGuidanceTasks(data.tasks || []);
          }
        })
        .catch(err => {
          console.error('Failed to fetch guidance:', err);
          toast.error("Failed to load application guidance");
        });
    }
  }, [lockedUniversityId, currentStage]);

  // Auto-scroll for interview chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interviewMessages, showMockInterview]);

  // Mock Interview Handler
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !lockedUniversity) return;

    const newMessage = { role: 'user' as const, content };
    setInterviewMessages(prev => [...prev, newMessage]);
    setInterviewInput("");
    setIsInterviewLoading(true);

    try {
      const apiMessages = [...interviewMessages, newMessage];
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          universityName: lockedUniversity.name
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

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

  // Content Review Handler
  const handleContentReview = async () => {
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

  // Toggle guidance task completion
  const handleToggleGuidanceTask = async (taskId: string) => {
    try {
      const task = guidanceTasks.find((t) => t.id === taskId);
      if (!task) return;

      const res = await fetch(`/api/guidance/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setGuidanceTasks(
        guidanceTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  // Add Task Handler
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          priority: newTaskPriority,
          stage: newTaskStage,
          completed: false,
          due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }),
      });

      if (response.ok) {
        const task = await response.json();
        addTask(task);
        toast.success('Task added successfully!');
        setShowAddTask(false);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskPriority('medium');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const STAGES = [
    { id: 1, label: 'Profile Building', desc: 'Focus on GPA, Test Scores, and Resume.' },
    { id: 2, label: 'Discovery Phase', desc: 'Research and shortlist universities.' },
    { id: 3, label: 'Standardized Tests', desc: 'IELTS/TOEFL and GRE/GMAT prep.' },
    { id: 4, label: 'Application Guidance', desc: 'SOPs, LORs, and direct submissions.' },
  ];

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white font-black border-red-600 shadow-lg shadow-red-600/20';
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      {/* Sidebar: AI Guidance */}
      <aside className="w-full lg:w-80 space-y-6">
        <Card className="p-6 bg-slate-900/40 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="h-20 w-20 text-yellow-400" />
          </div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 pt-1">AI Progress Tracker</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-400">Current Progress</span>
                <span className="text-2xl font-black text-white">{strength}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all duration-1000"
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-tight">Next Stage Unlock</p>
                  <p className="text-[10px] text-slate-500 mt-1">Complete your resume and GPA verification to unlock Phase 2.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-0.5">AI Counsellor Agent Status</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "The AI Counsellor Agent is currently monitoring {tasks.filter(t => !t.completed).length} pending tasks. Ensuring you stay on track for Fall 2026."
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-blue-400" />
            <h4 className="text-sm font-bold text-white">Quick Action</h4>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {lockedUniversity
              ? `Ready for ${lockedUniversity.name}? Practice with a university-specific mock interview.`
              : "Practice your storytelling and interview skills with our AI Counselor to prepare for your top choices."}
          </p>
          <button
            type="button"
            onClick={() => {
              if (lockedUniversity) {
                setInterviewMessages([
                  { role: 'assistant', content: `Welcome to your Mock Interview for ${lockedUniversity.name}! 🎓\n\nI am your admissions officer today. We'll go through 3-4 key questions about your academic background, your choice of ${lockedUniversity.name}, and your future goals. I'll provide feedback after each answer.\n\n**Let's begin: Could you please introduce yourself and tell me why you've chosen to apply for a Master's degree at ${lockedUniversity.name}?**` }
                ]);
                setShowMockInterview(true);
              } else {
                setInterviewMessages([
                  { role: 'assistant', content: `Welcome to your Practice Mock Interview! 🎓\n\nSince you haven't locked a university yet, we'll practice with general interview questions for top-tier Master's programs. This will help you sharpen your narrative.\n\n**Let's begin: Could you please introduce yourself and tell me about your long-term career goals?**` }
                ]);
                setShowMockInterview(true);
              }
            }}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {lockedUniversity ? "Start Mock Interview" : "Start Mock Interview Session"}
          </button>
        </Card>
      </aside>

      {/* Main Content: Task Flow */}
      <div className="flex-1 space-y-12">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter(t => (t.stage || 1) === stage.id);
          const isCurrent = currentStage === stage.id;
          const isCompleted = currentStage > stage.id;

          return (
            <section key={stage.id} className={`${!isCurrent && !isCompleted ? 'opacity-40 grayscale' : ''}`}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-yellow-400' : 'text-slate-500'}`}>
                      Phase 0{stage.id}
                    </span>
                    {isCurrent && (
                      <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 text-[9px] py-0">ACTIVE</Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white">{stage.label}</h2>
                  <p className="text-xs text-slate-500 mt-1">{stage.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">{stageTasks.filter(t => t.completed).length}/{stageTasks.length} Completed</span>
                  <button
                    onClick={() => {
                      setNewTaskStage(stage.id as 1 | 2 | 3 | 4);
                      setShowAddTask(true);
                    }}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {stageTasks.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No tasks generated for this phase</p>
                  </div>
                ) : (
                  stageTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${task.completed
                        ? 'bg-slate-900/40 border-white/5 opacity-60'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:scale-[1.01]'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`transition-all duration-300 ${task.completed ? 'text-emerald-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                          {task.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          {task.description && !task.completed && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!task.completed && (
                          <div className="flex items-center gap-2">
                            {/* AI Analyze Button for relevant tasks */}
                            {(task.title.toLowerCase().includes('sop') ||
                              task.title.toLowerCase().includes('essay') ||
                              task.title.toLowerCase().includes('resume') ||
                              task.title.toLowerCase().includes('cv')) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTask(task);
                                    setShowContentReview(true);
                                  }}
                                  className="h-7 text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 px-2 flex items-center gap-1 font-bold"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  AI ANALYZE
                                </Button>
                              )}

                            <Badge className={`text-[9px] py-0 font-black uppercase border ${getPriorityColor(task.priority || 'normal')}`}>
                              {task.priority || 'Normal'}
                            </Badge>
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-slate-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Application Guidance Tools - Only for Stage 4 when university is locked */}
              {stage.id === 4 && lockedUniversity && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Application Guidance Tools</h3>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px]">
                      {lockedUniversity.name}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mock Interview Card */}
                    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20 relative overflow-hidden">
                      <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                        AI POWERED
                      </div>
                      <MessageSquare className="w-10 h-10 text-purple-400 mb-3" />
                      <h4 className="text-lg font-semibold text-white mb-2">Mock Interview</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        Practice university-specific questions with AI feedback for {lockedUniversity.name}.
                      </p>
                      <Button
                        onClick={() => setShowMockInterview(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                      >
                        Start Interview →
                      </Button>
                    </Card>

                    {/* AI Content Review Card */}
                    <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20 relative overflow-hidden">
                      <div className="absolute top-2 right-2 px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded">
                        AI POWERED
                      </div>
                      <FileText className="w-10 h-10 text-teal-400 mb-3" />
                      <h4 className="text-lg font-semibold text-white mb-2">AI Content Review</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        Get instant AI feedback and scoring on your essays and SOPs.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedTask(guidanceTasks.find(t => t.category === 'Essay') || null);
                          setShowContentReview(true);
                        }}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                      >
                        Review Content →
                      </Button>
                    </Card>
                  </div>

                  {/* Guidance Tasks Checklist */}
                  {guidanceTasks.length > 0 && (
                    <Card className="p-6 bg-white/5 border-white/10 mt-6">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                        Application Checklist for {lockedUniversity.name}
                      </h4>
                      <div className="space-y-3">
                        {guidanceTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-lg hover:border-white/10 transition-all group"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => handleToggleGuidanceTask(task.id)}
                                className="flex-shrink-0"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-500" />
                                )}
                              </button>
                              <div className="flex-1">
                                <p className={`font-medium ${task.completed ? "text-slate-500 line-through" : "text-white"}`}>
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
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Mock Interview Modal */}
      {showMockInterview && lockedUniversity && (
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
                  AI Content Review {selectedTask ? `: ${selectedTask.title}` : ''}
                </h3>
                <p className="text-sm text-slate-400">
                  {lockedUniversity
                    ? `Reviewing for: ${lockedUniversity.name}`
                    : "General academic feedback and scoring"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowContentReview(false);
                setReviewResult(null);
                setEssayContent("");
                setSelectedTask(null);
              }}>
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
                      onClick={handleContentReview}
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
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-slate-900 border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <h3 className="text-xl font-bold text-white">Add New Task</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Description (Optional)</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  rows={4}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none shadow-inner"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Stage</label>
                <select
                  value={newTaskStage}
                  onChange={(e) => setNewTaskStage(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="1">Stage 1: Profile Building</option>
                  <option value="2">Stage 2: Discovery Phase</option>
                  <option value="3">Stage 3: Finalizing Selection</option>
                  <option value="4">Stage 4: Application Prep</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowAddTask(false)}
                  variant="outline"
                  className="flex-1 border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Task
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

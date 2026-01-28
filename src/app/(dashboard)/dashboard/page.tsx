'use client';

import Link from 'next/link';
import { useAppStore, AppStage } from '@/lib/store';
import {
   CheckCircle2,
   Circle,
   GraduationCap,
   MessageSquare,
   TrendingUp,
   Clock,
   ArrowUpRight,
   MoreHorizontal
} from 'lucide-react';

export default function DashboardPage() {
   const { user, currentStage, tasks, universities, toggleTask } = useAppStore();

   const handleToggleTask = async (taskId: string) => {
      toggleTask(taskId);

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      try {
         await fetch('/api/tasks', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               id: taskId,
               completed: !task.completed,
            }),
         });
      } catch (error) {
         console.error('Error updating task:', error);
         toggleTask(taskId);
      }
   };

   const getRoadmapDate = (stageId: AppStage) => {
      if (currentStage > stageId) return 'Completed';
      if (currentStage === stageId) return 'In Progress';

      // Future estimates
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const estMonth = months[(currentMonth + (stageId - currentStage)) % 12];
      return `Est. ${estMonth}`;
   };

   const stages: { id: AppStage, name: string, date: string }[] = [
      { id: 1, name: 'Profile Building', date: getRoadmapDate(1) },
      { id: 2, name: 'Discovery Phase', date: getRoadmapDate(2) },
      { id: 3, name: 'Finalizing Selection', date: getRoadmapDate(3) },
      { id: 4, name: 'Application Prep', date: getRoadmapDate(4) },
   ];

   // Calculate Profile Strength
   const calculateStrength = () => {
      let score = 0;
      if (user.education) score += 15;
      if (user.degree) score += 5;
      if (user.studyGoal) score += 15;
      if (user.preferredCountries.length > 0) score += 15;
      if (user.budgetMax > 0) score += 15;
      if (user.examStatus === 'completed') score += 15;
      else if (user.examStatus === 'scheduled') score += 5;

      // Quality factors
      if (user.gpa && parseFloat(user.gpa) >= 3.5) score += 10;
      else if (user.gpa) score += 5;

      if (user.targetField || user.degree) score += 10;

      return Math.min(100, score);
   };

   const strength = calculateStrength();

   // Get top recommendations (simple filter for now)
   const recommendations = universities.slice(0, 3);

   // Get active tasks (limit 3)
   const activeTasks = tasks.filter(t => !t.completed).slice(0, 3);

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
               <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
                  Mission Control
               </h1>
               <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  Welcome back, <span className="text-white font-semibold">{user.name || 'Student'}</span>. You are on track for your study abroad journey with <span className="text-blue-400 font-bold">96% Precision</span>.
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
               <Link href="/dashboard/onboarding" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto px-5 h-11 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/5 hover:border-white/10 transition-all text-sm font-bold uppercase tracking-wider">
                     Profile
                  </button>
               </Link>
               <Link href="/dashboard/ai-counsellor" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto px-6 h-11 rounded-xl bg-white text-black shadow-xl shadow-white/5 hover:bg-neutral-200 transition-all text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider">
                     <MessageSquare className="h-4 w-4" />
                     Ask AI
                  </button>
               </Link>
            </div>
         </div>

         {/* Progress Track */}
         <div className="glass-card p-1 rounded-2xl overflow-hidden">
            <div className="bg-slate-900/50 p-6 sm:p-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg text-white">Application Roadmap</h3>
                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
                     PHASE {currentStage}/4 ACTIVE
                  </span>
               </div>

               <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {stages.map((stage) => {
                        const isCompleted = currentStage > stage.id;
                        const isCurrent = currentStage === stage.id;
                        const isLocked = currentStage < stage.id;

                        return (
                           <div key={stage.id} className="relative z-10 flex flex-col md:items-center gap-4 md:gap-0">
                              <div className={`
                          w-10 h-10 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 bg-slate-950
                          ${isCompleted ? 'border-emerald-500 text-emerald-500' :
                                    isCurrent ? 'border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' :
                                       'border-white/5 text-white/5'}
                       `}>
                                 {isCompleted ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> :
                                    isCurrent ? <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-white animate-pulse" /> :
                                       <Circle className="h-4 w-4 md:h-5 md:w-5" />}
                              </div>

                              <div className="md:text-center md:mt-4">
                                 <h4 className={`font-bold ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                                    {stage.name}
                                 </h4>
                                 <p className="text-xs text-slate-500 mt-1">{stage.date}</p>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>
            </div>
         </div>

         {/* Main Grid */}
         <div className="grid lg:grid-cols-3 gap-6">
            {/* University Recommendations Card */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                     <GraduationCap className="h-5 w-5 text-blue-400" />
                     Top Recommendations
                  </h3>
                  <Link href="/dashboard/universities" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
                     View All <ArrowUpRight className="h-4 w-4" />
                  </Link>
               </div>

               <div className="space-y-3">
                  {recommendations.map((uni) => (
                     <div key={uni.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center font-display font-black text-white/20 group-hover:text-white group-hover:bg-blue-600 transition-all border border-white/5">
                              {uni.name.charAt(0)}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-200 group-hover:text-white truncate text-lg" title={uni.name}>{uni.name}</div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                                 <TrendingUp className="h-3 w-3" />
                                 {uni.location}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                           <div className="text-left sm:text-right">
                              <div className="text-sm font-black text-white">{uni.matchScore}% <span className="text-[10px] text-emerald-400 uppercase tracking-wider ml-1">Fit</span></div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{uni.tags[0]}</div>
                           </div>
                           <button className="p-2 sm:p-3 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                              <MoreHorizontal className="h-5 w-5" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Stats / Quick Actions */}
            <div className="space-y-6">
               <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent">
                  <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Profile Strength</h3>
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-4xl font-display font-bold text-white">{strength}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                     <div
                        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-500"
                        style={{ width: `${strength}%` }}
                     />
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Academics</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${user.gpa ? (parseFloat(user.gpa) >= 3.5 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-blue-400 border-blue-500/20 bg-blue-500/10') : 'text-slate-500 border-slate-700 bg-slate-800'
                           }`}>
                           {user.gpa ? (parseFloat(user.gpa) >= 3.5 ? 'STRONG' : 'AVERAGE') : 'UNKNOWN'}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Exams</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${user.examStatus === 'completed' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                           user.examStatus === 'scheduled' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                              'text-amber-400 border-amber-500/20 bg-amber-500/10'
                           }`}>
                           {user.examStatus === 'completed' ? 'COMPLETED' : user.examStatus === 'scheduled' ? 'IN PROGRESS' : 'NOT STARTED'}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">SOP</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tasks.some(t => t.title.includes('SOP') && t.completed) ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                           'text-amber-400 border-amber-500/20 bg-amber-500/10'
                           }`}>
                           {tasks.some(t => t.title.includes('SOP') && t.completed) ? 'READY' : 'DRAFTING'}
                        </span>
                     </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-6">
                     {strength < 100 ? 'Complete your profile details to reach 100% strength.' : 'Profile is excellent!'}
                  </p>
               </div>

               <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                     <Clock className="h-5 w-5 text-amber-400" />
                     Pending Tasks
                  </h3>
                  <div className="space-y-3">
                     {activeTasks.length > 0 ? activeTasks.map((task) => (
                        <div
                           key={task.id}
                           onClick={() => handleToggleTask(task.id)}
                           className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                           <div className={`mt-1 h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-blue-600' : 'bg-amber-500'}`} />
                           <div>
                              <p className="text-sm font-medium text-slate-200">{task.title}</p>
                              <p className="text-xs text-slate-500 mt-1">Due: {task.due}</p>
                           </div>
                        </div>
                     )) : (
                        <p className="text-slate-500 text-sm">No pending tasks.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

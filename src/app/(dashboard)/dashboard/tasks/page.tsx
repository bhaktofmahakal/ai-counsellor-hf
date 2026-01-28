'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/lightswind/card';
import { Badge } from '@/components/lightswind/badge';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Input } from '@/components/lightswind/input';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  Plus,
  Lock,
  X,
  Loader2
} from 'lucide-react';
import { useAppStore, Task } from '@/lib/store';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, toggleTask, currentStage, lockedUniversityId, universities, user, setTasks, addTask } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user.id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user.id, setTasks]);

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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newTaskTitle,
          completed: false,
          priority: 'medium',
          stage: currentStage || 2,
        }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        addTask(createdTask);
        setNewTaskTitle('');
        setIsAddingTask(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lockedUni = lockedUniversityId ? universities.find(u => u.id === lockedUniversityId) : null;

  // Filter tasks based on stage visibility
  // If stage < 3, don't show stage 3/4 tasks unless explicitly needed? 
  // For simplicity, we show all tasks <= currentStage + 1 (preview next stage)
  // BUT Requirement: "Prevent application guidance until university is locked" (Stage 4)
  const visibleTasks = tasks.filter(t => {
    if (t.stage === 4 && !lockedUniversityId) return false;
    return true;
  });

  const filteredTasks = visibleTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = visibleTasks.filter(t => t.completed).length;
  const totalCount = visibleTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const priorityColors = {
    critical: 'bg-red-600/10 text-red-400 border border-red-600/20',
    high: 'bg-blue-600/10 text-blue-400 border border-blue-600/20',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    low: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  };

  const isOverdue = (deadline: string) => {
    // Simple check, assumes deadline is string date
    return false; // Implement proper date check if needed
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            Application Tasks
          </h1>
          <p className="text-slate-400">
            Track your progress and stay on schedule
          </p>
        </div>
        <GradientButton
          gradientColors={['#2563eb', '#8b5cf6']}
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </GradientButton>
      </div>

      {isAddingTask && (
        <Card className="p-6 bg-slate-900 border-blue-600/50 mb-6 relative">
          <button
            onClick={() => setIsAddingTask(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-bold text-white mb-4">Create New Task</h3>
          <form onSubmit={handleAddTask} className="flex gap-3">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g., Draft SOP for MIT"
              className="flex-1 bg-slate-950/50 border-white/10 text-white"
              autoFocus
            />
            <GradientButton
              type="submit"
              disabled={isSubmitting || !newTaskTitle.trim()}
              className="px-6"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create'}
            </GradientButton>
          </form>
        </Card>
      )}

      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Overall Progress</h3>
          <span className="text-sm text-slate-400">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          You're {Math.round(progress)}% done with your available tasks!
        </p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-400">Filter:</span>
          {(['all', 'todo', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Locked University Banner */}
      {lockedUniversityId && lockedUni ? (
        <Card className="p-6 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Application Guidance Unlocked</h3>
              <p className="text-slate-400 text-sm">
                Showing specific tasks for **{lockedUni.name}**. Good luck with your application!
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-blue-600/10 to-violet-600/10 border-blue-600/20">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                Lock a university to unlock application tasks
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Once you lock your final university choice, we will generate specific SOP, document, and form tasks for you.
              </p>
              <GradientButton
                size="sm"
                gradientColors={['#2563eb', '#8b5cf6']}
                onClick={() => router.push('/dashboard/universities')}
              >
                Go to Universities
              </GradientButton>
            </div>
          </div>
        </Card>
      )}

      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/10">
          <Circle className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No tasks match your filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            return (
              <Card
                key={task.id}
                className={`p-5 hover:bg-white/10 transition-all border-white/10 ${task.completed ? 'bg-white/[0.02]' : 'bg-white/5'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 fill-current opacity-50" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 ${task.completed ? 'line-through text-slate-500' : 'text-white'
                            }`}
                        >
                          {task.title}
                        </h3>
                        {/* We don't have description in store Type yet, treating title as main */}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className={`flex items-center gap-1 text-slate-500`}>
                        <Calendar className="h-4 w-4" />
                        <span>{task.due}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

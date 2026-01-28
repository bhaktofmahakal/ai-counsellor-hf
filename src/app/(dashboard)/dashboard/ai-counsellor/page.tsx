'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import {
  Send,
  Sparkles,
  User,
  Lightbulb,
  Mic,
  MicOff,
  Plus,
  History,
  Trash2,
  MessageSquare,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/lightswind/avatar';
import { useAppStore } from '@/lib/store';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { toast } from 'sonner';

type Message = {
  id: number | string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
};

type ChatSession = {
  sessionId: string;
  title: string;
  createdAt: string;
};

export default function AICounsellorPage() {
  const router = useRouter();
  const {
    user,
    currentStage,
    universities,
    toggleShortlist,
    lockUniversity,
    shortlistedIds,
    addTask,
    setTasks
  } = useAppStore();

  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined') return;

    // Fixed: Ensure any existing speech is totally stopped before starting new one
    window.speechSynthesis.cancel();

    // Fixed: Strip markdown and robotic words
    const cleanSpeechText = text
      .replace(/[*#_`~]/g, '') // Remove markdown symbols
      .replace(/\[ACTION:.*?\]/g, '') // Remove action tags
      .replace(/=/g, ' is ') // Convert symbols to words
      .replace(/\./g, '. ') // Ensure pause after dots (but keep the dot)
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);

    // Better defaults for natural feel
    utterance.rate = 1.05; // Slightly faster for less robotic feel
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Choose a better voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Fixed: Stop talking if user toggles speech OFF manually
  useEffect(() => {
    if (!isSpeechEnabled && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
  }, [isSpeechEnabled]);

  const refreshTasks = async () => {
    if (!user.id) return;
    try {
      const response = await fetch(`/api/tasks?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (e) {
      console.error('Error refreshing tasks:', e);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send if it's a clear command? For now just set input
    };

    recognition.start();
  };

  useEffect(() => {
    if (!user.onboardingCompleted && user.email) {
      router.push('/dashboard/onboarding');
    }
  }, [user.onboardingCompleted, user.email, router]);

  // Load Sessions List
  const loadSessions = async () => {
    if (!user.id) return;
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}&listSessions=true`);
      if (response.ok) {
        const data = await response.json();
        // data will be the unique records representing each session
        setSessions(data.map((s: any) => ({
          sessionId: s.sessionId || 'default',
          title: s.title || 'New Chat',
          createdAt: s.createdAt
        })));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Load Message History for a specific session
  const loadHistory = async (sessionId: string) => {
    if (!user.id) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}&sessionId=${sessionId}`);
      if (response.ok) {
        const history = await response.json();
        if (history.length > 0) {
          setMessages(history.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.createdAt),
          })));
        } else {
          setMessages([
            {
              id: Date.now(),
              role: 'assistant',
              content: `Hi ${user.name || 'there'}! 👋 I'm your **AI Study Abroad Counsellor**. I've started a fresh session for you.\n\nHow can I help you today?`,
              timestamp: new Date(),
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadSessions();
    loadHistory(activeSessionId);
  }, [user.id, activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = () => {
    const newId = `session_${Date.now()}`;
    setActiveSessionId(newId);
    setMessages([]);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim() || !user.id) return;

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const isFirstMessage = messages.length <= 1;
    const sessionTitle = isFirstMessage ? currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : '') : undefined;

    const userMessage: Message = {
      id: `temp-user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Save user message to DB
    try {
      fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          role: 'user',
          content: currentInput,
          sessionId: activeSessionId,
          title: sessionTitle
        }),
      });
      // Refresh sessions list if it was first message
      if (isFirstMessage) setTimeout(loadSessions, 1000);
    } catch (e) {
      console.error('Error saving user message:', e);
    }

    const assistantMessageId = `temp-ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          userProfile: user,
          currentStage,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsTyping(false);
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, streaming: false }
                    : msg
                )
              );

              processAIActions(accumulatedContent);

              try {
                const cleaned = cleanContent(accumulatedContent);
                speak(cleaned);

                fetch('/api/conversations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.id,
                    role: 'assistant',
                    content: accumulatedContent,
                    sessionId: activeSessionId
                  }),
                });
              } catch (e) {
                console.error('Error saving assistant message:', e);
              }
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
              ...msg,
              content: '⚠️ I encountered an error. Please try again.',
              streaming: false,
            }
            : msg
        )
      );
      setIsTyping(false);
    }
  };

  const processAIActions = async (content: string) => {
    const actionRegex = /\[ACTION:\s*(\w+),\s*([^\]]+)\]/g;
    let match;

    while ((match = actionRegex.exec(content)) !== null) {
      const actionType = match[1].toLowerCase();
      const args = match[2].split(',').map(s => s.trim());

      try {
        if (actionType === 'shortlist') {
          await handleShortlist(args[0]);
          await refreshTasks();
        } else if (actionType === 'lock') {
          await handleLock(args[0]);
          await refreshTasks();
        } else if (actionType === 'task') {
          await handleAddTask(args[0], args[1] || 'medium');
          await refreshTasks();
        }
      } catch (error) {
        console.error(`Error executing AI action ${actionType}:`, error);
      }
    }
  };

  const handleShortlist = async (universityId: string) => {
    if (!user.id) return;
    try {
      const response = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, universityId }),
      });
      if (response.ok) {
        toggleShortlist(universityId);
        const uni = universities.find(u => u.id === universityId);
        toast.success(`University Shortlisted: ${uni?.name || universityId}`);
      }
    } catch (error) { console.error('Error shortlisting:', error); }
  };

  const handleLock = async (universityId: string) => {
    if (!user.email) return;
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, lockedUniversityId: universityId, currentStage: 4 }),
      });
      if (response.ok) {
        lockUniversity(universityId);
        toast.info("University Locked! Application phase unlocked.");
      }
    } catch (error) { console.error('Error locking:', error); }
  };

  const handleAddTask = async (title: string, priority: string) => {
    if (!user.id) return;
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title, priority: priority.toLowerCase(), stage: 2 }),
      });
      if (response.ok) {
        const task = await response.json();
        addTask(task);
        toast.success(`New Task Created: ${title}`);
      }
    } catch (error) { console.error('Error adding task:', error); }
  };

  const suggestedQuestions = [
    "Recommend universities for me",
    "How strong is my profile?",
    "What should be my budget strategy?",
    "Help me improve my application",
  ];

  const cleanContent = (content: string) => {
    return content
      .replace(/\[ACTION:\s*\w+,\s*[^\]]+\]/g, '')
      .replace(/\[DATA:\s*\{.*?\}\]/g, '') // Also remove data tags
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 max-w-7xl mx-auto">
      {/* Session Sidebar */}
      <aside className="w-64 flex flex-col gap-4">
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" />
          New Chat
        </button>

        <Card className="flex-1 bg-white/5 border-white/10 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-2 text-slate-400 font-semibold">
            <History className="h-4 w-4" />
            Chat History
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm italic">
                No history yet
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.sessionId}
                  onClick={() => setActiveSessionId(s.sessionId)}
                  className={`w-full text-left p-3 rounded-lg text-sm group transition-all flex items-center gap-3 ${activeSessionId === s.sessionId
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                >
                  <MessageSquare className={`h-4 w-4 flex-shrink-0 ${activeSessionId === s.sessionId ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="truncate flex-1">{s.title || 'Untitled Chat'}</span>
                  <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSessionId === s.sessionId ? 'opacity-100' : ''}`} />
                </button>
              ))
            )}
          </div>
        </Card>
      </aside>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-white">
              {sessions.find(s => s.sessionId === activeSessionId)?.title || 'New Conversation'}
            </h2>
          </div>
          {messages.length > 5 && (
            <p className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">{messages.length} messages</p>
          )}
          <button
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className={`p-2 rounded-lg transition-all ${isSpeechEnabled ? 'text-blue-400 bg-blue-600/10' : 'text-slate-500 bg-white/5'}`}
            title={isSpeechEnabled ? "Disable Voice" : "Enable Voice"}
          >
            {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
              <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <p>Loading conversation...</p>
            </div>
          ) : messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                {message.role === 'assistant' ? (
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10">
                    <AvatarImage src="/ai-avatar.png" alt="AI Agent" />
                    <AvatarFallback><Sparkles className="h-5 w-5 text-blue-400" /></AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-10 w-10 ring-2 ring-white/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-lg shadow-blue-600/10'
                  : 'bg-white/10 text-slate-200 rounded-tl-sm border border-white/5 shadow-inner'
                  }`}>
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer content={cleanContent(message.content)} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {message.content}
                    </p>
                  )}
                  {message.streaming && (
                    <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 anim-pulse-subtle">
                <div className="flex gap-1.5 p-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && !isLoadingHistory && (
          <div className="px-6 pb-4">
            <p className="text-sm text-slate-400 mb-3 ml-1 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-emerald-400" />
              Quick start topics:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="text-left p-3 text-sm bg-white/5 border border-white/10 rounded-xl hover:border-blue-600/50 hover:bg-blue-600/10 text-slate-300 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-transparent transition-all" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 p-4 bg-slate-950/30">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask me anything about your study abroad journey..."
                className="w-full bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-600/50 pr-12 transition-all h-12 rounded-xl"
                disabled={isTyping}
              />
              <button
                onClick={startListening}
                disabled={isTyping}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-500 hover:text-white'
                  }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        .anim-pulse-subtle { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}

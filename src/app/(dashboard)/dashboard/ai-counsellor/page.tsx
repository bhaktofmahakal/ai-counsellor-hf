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
  VolumeX,
  Phone,
  PhoneOff
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/lightswind/avatar';
import { useAppStore } from '@/lib/store';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
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

const QUICK_ACTIONS = [
  { id: 'uni', label: 'Recommend universities for me', icon: Sparkles },
  { id: 'profile', label: 'How strong is my profile?', icon: User },
  { id: 'budget', label: 'What should be my budget strategy?', icon: Lightbulb },
  { id: 'improve', label: 'Help me improve my application', icon: ChevronRight },
];

export default function AICounsellorPage() {
  const router = useRouter();
  const {
    user,
    currentStage,
    universities,
    toggleShortlist,
    lockUniversity,
    tasks,
    setTasks,
    addTask
  } = useAppStore();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isCallMode, setIsCallMode] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAISpeakingRef = useRef(false);
  const lastProcessedTranscriptRef = useRef('');
  const isCallModeRef = useRef(isCallMode);
  const isTypingRef = useRef(isTyping);
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingQueueRef = useRef(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => { isCallModeRef.current = isCallMode; }, [isCallMode]);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  const stopSpeaking = () => {
    isAISpeakingRef.current = false;
    speechQueueRef.current = []; // Clear queue on interruption
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  const processSpeechQueue = async () => {
    if (isSpeakingQueueRef.current || speechQueueRef.current.length === 0) return;

    isSpeakingQueueRef.current = true;
    const nextText = speechQueueRef.current.shift();
    if (nextText) {
      await speak(nextText, () => {
        isSpeakingQueueRef.current = false;
        processSpeechQueue();
      });
    } else {
      isSpeakingQueueRef.current = false;
    }
  };

  const speak = async (text: string, onEnd?: () => void) => {
    if (!isSpeechEnabled || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    // ALLOW INTERRUPTION: Keep mic open so user can stop AI
    // if (isCallModeRef.current) stopMic(); <--- Removed this to allow interruption
    isAISpeakingRef.current = true;

    const cleanSpeechText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[ACTION:.*?\]/g, '')
      .replace(/\[DATA:.*?\]/g, '')
      .replace(/=/g, ' is ')
      .trim();

    if (!cleanSpeechText) {
      isAISpeakingRef.current = false;
      if (onEnd) onEnd();
      return;
    }

    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSpeechText }),
      });

      if (!response.ok) throw new Error('TTS Failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setCurrentAudio(audio);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setCurrentAudio(null);
        isAISpeakingRef.current = false;
        if (onEnd) onEnd();
        if (isCallModeRef.current && speechQueueRef.current.length === 0) {
          startListening(true);
        }
      };

      await audio.play();
    } catch (e) {
      console.warn('Speech Fallback:', e);
      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.onend = () => {
        isAISpeakingRef.current = false;
        if (onEnd) onEnd();
        if (isCallModeRef.current && speechQueueRef.current.length === 0) {
          startListening(true);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = (autoSend = false) => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Don't start if AI is already talking
    if (isAISpeakingRef.current) return;

    stopMic();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = isCallModeRef.current;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Restart mic loop for Call Mode, but ONLY if AI isn't speaking
      if (isCallModeRef.current && !isTypingRef.current && !isAISpeakingRef.current) {
        setTimeout(() => {
          if (isCallModeRef.current && !isTypingRef.current && !isAISpeakingRef.current) {
            try { recognition.start(); } catch (e) { }
          }
        }, 500);
      }
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }

      const clean = transcript.trim();
      if (!clean || clean === lastProcessedTranscriptRef.current) return;

      // INTERRUPTION DETECTION: If user speaks while AI is talking, interrupt!
      if (isAISpeakingRef.current && isCallModeRef.current) {
        console.log('🛑 User interrupted AI!');
        stopSpeaking();
        // Don't return - let the new input be processed
      }

      setInput(clean);

      if (autoSend && isCallModeRef.current) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        const wait = isFinal ? 1200 : 2500;
        silenceTimerRef.current = setTimeout(() => {
          if (clean === lastProcessedTranscriptRef.current) return;
          lastProcessedTranscriptRef.current = clean;
          stopMic(); // Stop before sending
          handleSend(clean);
        }, wait);
      }
    };

    try { recognition.start(); } catch (e) { }
  };

  const toggleCallMode = () => {
    const next = !isCallMode;
    setIsCallMode(next);
    isCallModeRef.current = next; // Sync Ref Update

    if (next) {
      setIsSpeechEnabled(true);
      toast.success("Call Mode Active", { description: "Speak naturally, AI will answer." });

      // AUTO-GREETING: AI greets user automatically
      setTimeout(() => {
        const greeting = messages.length === 0
          ? "Hello! I'm your AI study abroad counselor. How can I help you today?"
          : "I'm listening. What would you like to know?";

        speak(greeting, () => {
          // After greeting, start listening
          if (isCallModeRef.current) startListening(true);
        });
      }, 500);
    } else {
      stopMic();
      stopSpeaking();
      toast.info("Call Mode Deactivated");
    }
  };

  const processedActionsRef = useRef<Set<string>>(new Set());

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() || !user.id || !activeSessionId) return;

    const currentInput = textToSend;
    setInput('');
    setIsTyping(true);
    lastProcessedTranscriptRef.current = currentInput;
    processedActionsRef.current = new Set(); // Reset for new AI response

    if (!isCallMode) stopMic();

    const isFirst = messages.length <= 1;
    const userMsg: Message = { id: Date.now(), role: 'user', content: currentInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: 'user', content: currentInput, sessionId: activeSessionId, title: isFirst ? currentInput.slice(0, 30) : undefined }),
      });

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          userProfile: { ...user, tasks },
          currentStage,
          conversationHistory: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.body) {
        setIsTyping(false);
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let spokenCharacters = 0;
      const assistantId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), streaming: true }]);

      speechQueueRef.current = []; // Reset queue for new response

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
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated, streaming: false } : m));

              const remainder = accumulated.slice(spokenCharacters).trim();
              if (remainder.length > 0) {
                speechQueueRef.current.push(remainder);
                processSpeechQueue();
              }

              // ACTION PARSER - Handle multiple actions
              const actionRegex = /\[ACTION:\s*(\w+),\s*(.*?)\]/gi;
              const matches = Array.from(accumulated.matchAll(actionRegex));

              for (const match of matches) {
                const actionString = match[0];
                if (processedActionsRef.current.has(actionString)) continue;
                processedActionsRef.current.add(actionString);

                const actionType = match[1].toLowerCase();
                const params = match[2].split(',').map(p => p.trim());

                if (actionType === 'task') {
                  const title = params[0];
                  const priority = params[1] || 'medium';
                  const taskStage = params[2] ? parseInt(params[2]) : (currentStage || 1);

                  fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user.id,
                      title,
                      priority,
                      completed: false,
                      stage: taskStage
                    })
                  }).then(res => res.ok ? res.json() : null).then(task => {
                    if (task) {
                      addTask(task);
                      toast.success(`Task Created: ${title}`);
                    }
                  });
                } else if (actionType === 'document') {
                  const title = params[0] || 'AI Draft';
                  const type = (params[1] || 'SOP').toUpperCase();

                  // Prioritize content within delimiters
                  let docContent = '';
                  const contentMatch = accumulated.match(/\[\[\[DOC_CONTENT_START\]\]\]([\s\S]*?)\[\[\[DOC_CONTENT_END\]\]\]/i);
                  if (contentMatch) {
                    docContent = contentMatch[1].trim();
                  } else {
                    // Fallback to removing all action tags
                    docContent = accumulated.replace(/\[ACTION:.*?\]/gi, '').trim();
                  }

                  if (docContent) {
                    fetch('/api/documents', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, type, content: docContent, status: 'draft' })
                    }).then(res => {
                      if (res.ok) toast.success(`Document Saved: ${title}`);
                    });
                  }
                } else if (actionType === 'shortlist') {
                  const uniId = params[0];
                  if (uniId) {
                    toggleShortlist(uniId); // Optimistic
                    fetch('/api/shortlist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user.id, universityId: uniId })
                    });
                    toast.success("University Shortlisted");
                  }
                } else if (actionType === 'lock') {
                  const uniId = params[0];
                  if (uniId) {
                    lockUniversity(uniId);
                    fetch('/api/user', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: user.email, lockedUniversityId: uniId, currentStage: 4 })
                    });
                    toast.success("University Locked!");
                  }
                }
              }

              fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, role: 'assistant', content: accumulated, sessionId: activeSessionId }),
              });
              if (isFirst) loadSessions();
              break;
            }
            try {
              const json = JSON.parse(data);
              if (json.content) {
                accumulated += json.content;

                // Throttled state update for UI performance
                const now = Date.now();
                if (now - lastUpdateRef.current > 60 || accumulated.length < 20) {
                  setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
                  lastUpdateRef.current = now;
                }

                const newContent = accumulated.slice(spokenCharacters);
                const sentenceEndMatch = newContent.match(/[.!?](\s|$)/);

                if (sentenceEndMatch) {
                  const sentenceEndIndex = (sentenceEndMatch.index || 0) + 1;
                  const fullSentence = newContent.slice(0, sentenceEndIndex).trim();

                  if (fullSentence.length > 5) {
                    speechQueueRef.current.push(fullSentence);
                    spokenCharacters += sentenceEndIndex;
                    processSpeechQueue();
                  }
                }
              }
            } catch (e) { }
          }
        }
      }
    } catch (e) {
      setIsTyping(false);
      toast.error("Message failed");
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat history?")) return;
    try {
      const res = await fetch(`/api/conversations?sessionId=${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        if (activeSessionId === sessionId) startNewChat();
        toast.success("Chat deleted");
      }
    } catch (e) {
      toast.error("Failed to delete chat");
    }
  };

  const loadSessions = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`/api/conversations?userId=${user.id}&listSessions=true`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.map((s: any) => ({ sessionId: s.sessionId, title: s.title || 'Untitled', createdAt: s.createdAt })));
      }
    } catch (e) { }
  };

  const loadHistory = async (sid: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/conversations?userId=${user.id}&sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m: any) => ({ id: m.id, role: m.role, content: m.content, timestamp: new Date(m.createdAt) })));
      }
    } finally { setIsLoadingHistory(false); }
  };

  useEffect(() => {
    if (user.id) {
      loadSessions();
      if (!activeSessionId) setActiveSessionId(`session_${Date.now()}`);
    }
  }, [user.id]);

  useEffect(() => {
    if (user.id && activeSessionId) loadHistory(activeSessionId);
  }, [activeSessionId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startNewChat = () => {
    setActiveSessionId(`session_${Date.now()}`);
    setMessages([]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] flex gap-6 max-w-7xl mx-auto p-2 lg:p-0">
      {/* Premium Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col gap-4">
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white font-bold shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="h-5 w-5" /> New Conversation
        </button>

        <Card className="flex-1 bg-slate-900/40 backdrop-blur-xl border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
            <History className="h-4 w-4" /> Recent History
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {sessions.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => setActiveSessionId(s.sessionId)}
                className={`group w-full text-left p-4 rounded-xl text-sm flex items-center gap-3 transition-all relative ${activeSessionId === s.sessionId
                  ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 shadow-lg'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate flex-1">{s.title}</span>
                <div
                  role="button"
                  onClick={(e) => deleteSession(s.sessionId, e)}
                  className="p-1 rounded-md hover:bg-red-500/20 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </aside>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-900/40 backdrop-blur-3xl border-white/5 relative shadow-2xl rounded-[1.5rem] lg:rounded-3xl">
        {/* Header */}
        <div className="p-3 lg:p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2 lg:gap-4 flex-1">
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-sm lg:text-lg tracking-tight truncate">AI Counsellor</h2>
              <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="h-1 lg:h-1.5 w-1 lg:w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] lg:text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={toggleCallMode}
              className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-all flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-bold uppercase ${isCallMode
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 ring-1 ring-white/10'
                }`}
            >
              {isCallMode ? <PhoneOff className="h-3.5 w-3.5 lg:h-4 lg:w-4" /> : <Phone className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
              <span className="hidden sm:inline">{isCallMode ? 'Live Mode' : 'Voice Call'}</span>
            </button>
            <button
              onClick={() => {
                const next = !isSpeechEnabled;
                setIsSpeechEnabled(next);
                if (!next) stopSpeaking(); // Stop immediately if muted
              }}
              className={`p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl transition-all ring-1 ring-white/10 ${isSpeechEnabled ? 'text-blue-400 bg-blue-600/10' : 'text-slate-500 bg-white/5'
                }`}
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4 lg:h-5 lg:w-5" /> : <VolumeX className="h-4 w-4 lg:h-5 lg:w-5" />}
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" role="log" aria-live="polite">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full text-blue-500/50"><div className="h-12 w-12 border-4 border-current border-t-transparent rounded-full animate-spin" /></div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-10 gap-6">
              <div className="h-24 w-24 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 animate-bounce"><Sparkles className="h-12 w-12" /></div>
              <h1 className="text-3xl font-bold text-white">Namaste! 👋</h1>
              <p className="text-slate-400 max-w-sm">I'm your AI counsellor. Let's start by planning your international career journey.</p>

              {/* Quick Actions Grid integrated here */}
              {!isTyping && (
                <div className="pt-8 w-full max-w-xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] px-2">
                    <Lightbulb className="h-3 w-3 text-blue-400" />
                    Quick start topics:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleSend(action.label)}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-600/5 transition-all text-left group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-colors">
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`h-11 w-11 shadow-xl ring-2 ${m.role === 'assistant' ? 'ring-blue-600/30' : 'ring-white/10'}`}>
                  {m.role === 'assistant' ? (
                    <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white"><Sparkles className="h-5 w-5" /></AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-slate-800 text-slate-300">{(user.name || 'U').charAt(0)}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`group relative max-w-[80%] flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-4 rounded-[2rem] shadow-xl ${m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-lg border border-white/10'
                    : 'bg-white/5 backdrop-blur-md text-slate-200 rounded-tl-lg border border-white/5'
                    }`}>
                    {m.role === 'assistant' ? <MarkdownRenderer content={m.content} /> : <p className="text-sm leading-relaxed">{m.content}</p>}
                  </div>
                  <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 flex items-center justify-center text-blue-500 animate-spin"><Sparkles className="h-6 w-6" /></div>
              <p className="text-sm text-blue-500/70 font-bold animate-pulse uppercase tracking-widest">Studying Profile...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-6 bg-slate-950/40 border-t border-white/5">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4">
            <div className="relative flex-1">
              <Input
                id="chat-input"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isCallMode ? "Listening... speak now!" : "Ask anything about your career..."}
                className={`bg-slate-900/60 border-white/10 h-14 rounded-2xl px-6 pr-14 text-white placeholder:text-slate-500 shadow-inner focus:ring-2 focus:ring-blue-600 transition-all ${isCallMode ? 'border-emerald-500/40 text-emerald-400' : ''}`}
                disabled={isTyping}
              />
              <button
                type="button"
                onClick={() => startListening(false)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-slate-500 hover:text-white'
                  }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-2xl font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-20"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="mt-3 text-[10px] text-center text-slate-600 font-medium">Powering your Global Ambition 🌎 NextStep AI Vision v1</p>
        </div>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }
        body { background: radial-gradient(circle at top right, #0a0a1a, #000); }
      `}</style>
    </div>
  );
}

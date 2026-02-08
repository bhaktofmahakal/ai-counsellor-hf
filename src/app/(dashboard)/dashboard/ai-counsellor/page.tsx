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
    PhoneOff,
    FileText,
    ClipboardList,
    UserCheck
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
    { id: 'profile', label: 'Analyze my profile strengths and gaps', icon: UserCheck },
    { id: 'uni', label: 'Recommend Dream, Target, and Safe universities', icon: Sparkles },
    { id: 'roadmap', label: 'What are my next steps for current stage?', icon: ClipboardList },
    { id: 'sop', label: 'Generate a university-specific SOP draft', icon: FileText },
];

export default function AICounsellorPage() {
    const router = useRouter();
    const {
        user,
        currentStage,
        setStage,
        universities,
        lockedUniversityId,
        shortlistedIds,
        toggleShortlist,
        lockUniversity,
        tasks,
        setTasks,
        addTask,
        setUniversities: setGlobalUniversities
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
    const abortControllerRef = useRef<AbortController | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const isAISpeakingRef = useRef(false);
    const lastProcessedTranscriptRef = useRef('');
    const isCallModeRef = useRef(isCallMode);
    const isTypingRef = useRef(isTyping);
    const speechQueueRef = useRef<string[]>([]);
    const isSpeakingQueueRef = useRef(false);
    const lastUpdateRef = useRef(0);

    // Persona State
    const [selectedPersona, setSelectedPersona] = useState<'standard' | 'strict' | 'friendly' | 'career'>('standard');
    const [showPersonaSelector, setShowPersonaSelector] = useState(false);

    const PERSONAS = [
        {
            id: 'standard' as const,
            name: 'Standard Counselor',
            icon: '🎓',
            desc: 'Balanced guidance with comprehensive insights',
            color: 'blue'
        },
        {
            id: 'strict' as const,
            name: 'Strict Coach',
            icon: '💪',
            desc: 'Direct, no-nonsense feedback and tough love',
            color: 'red'
        },
        {
            id: 'friendly' as const,
            name: 'Friendly Mentor',
            icon: '😊',
            desc: 'Supportive, encouraging, and empathetic',
            color: 'emerald'
        },
        {
            id: 'career' as const,
            name: 'Career Coach',
            icon: '💼',
            desc: 'ROI-driven, job placement, and career outcomes',
            color: 'amber'
        }
    ];

    const currentPersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

    useEffect(() => { isCallModeRef.current = isCallMode; }, [isCallMode]);
    useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

    const stopSpeaking = () => {
        isAISpeakingRef.current = false;
        speechQueueRef.current = [];

        // Abort active fetch requests on interruption
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
            setCurrentAudio(null);
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };

    // Close persona selector when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (showPersonaSelector) {
                setShowPersonaSelector(false);
            }
        };

        if (showPersonaSelector) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showPersonaSelector]);

    const unlockAudioContext = () => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
                // Create an empty buffer to play and unlock
                const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);
                source.start(0);
            }
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
            .replace(/\[ACTION:[\s\S]*?\]/gi, '')
            .replace(/\[DATA:[\s\S]*?\{[\s\S]*?\}\s*\]/gi, '')
            .replace(/\[\[\[DOC_CONTENT_START\]\]\][\s\S]*?\[\[\[DOC_CONTENT_END\]\]\]/gi, '')
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
        recognition.onerror = (event: any) => {
            console.error('Mic Error:', event.error);
            if (event.error === 'not-allowed') {
                toast.error("Microphone Blocked", { description: "Please allow microphone access in your browser settings." });
                setIsCallMode(false);
                isCallModeRef.current = false;
            }
            setIsListening(false);
        };
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
            // INTERRUPTION DETECTION: If user speaks while AI is talking, interrupt!
            if (isAISpeakingRef.current && isCallModeRef.current) {
                console.log('🛑 User interrupted AI!');
                stopSpeaking();
                // Don't return - let the new input be processed
            }

            // PREVENT AI FROM HEARING ITSELF: Ignore results if AI is currently outputting audio
            // Unless it was an interruption which we already handled above
            if (isAISpeakingRef.current) return;

            let transcript = '';
            let isFinal = false;
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) isFinal = true;
            }

            const clean = transcript.trim();
            if (!clean || clean === lastProcessedTranscriptRef.current) return;

            setInput(clean);

            if (autoSend && isCallModeRef.current) {
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                // Snappier silence detection: 800ms for final, 1800ms for interim
                const wait = isFinal ? 800 : 1800;
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
        unlockAudioContext();

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

    const syncAll = async () => {
        if (!user.email) return;
        try {
            const res = await fetch(`/api/user?email=${user.email}`);
            if (res.ok) {
                const dbUser = await res.json();
                const {
                    updateUser, setStage, setShortlistedIds, lockUniversity, setTasks
                } = useAppStore.getState();

                updateUser(dbUser);
                if (dbUser.currentStage) setStage(dbUser.currentStage);
                if (dbUser.lockedUniversityId) lockUniversity(dbUser.lockedUniversityId);
                if (dbUser.shortlists) setShortlistedIds(dbUser.shortlists.map((s: any) => s.universityId));
                if (dbUser.tasks) setTasks(dbUser.tasks);
            }
        } catch (e) { console.error("Sync failed:", e); }
    };

    const handleSend = async (manualInput?: string) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() || !user.id || !activeSessionId) return;

        const currentInput = textToSend;
        setInput('');
        setIsTyping(true);
        lastProcessedTranscriptRef.current = currentInput;
        processedActionsRef.current = new Set(); // Reset for new AI response

        if (!isCallMode) stopMic();
        unlockAudioContext();

        // Abort any existing request before starting a new one
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const isFirst = messages.length <= 1;
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: currentInput, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        // Ensure universities are loaded in store for action context
        if (universities.length === 0) {
            fetch('/api/universities?rag=true')
                .then(res => res.json())
                .then(data => setGlobalUniversities(data))
                .catch(() => { });
        }

        try {
            fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, role: 'user', content: currentInput, sessionId: activeSessionId, title: isFirst ? currentInput.slice(0, 30) : undefined }),
            });

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                    message: currentInput,
                    userProfile: { ...user, tasks, lockedUniversityId, shortlistedIds },
                    currentStage,
                    persona: selectedPersona,
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

                            // ACTION PARSER - Handle multiple actions with robust regex
                            const actionRegex = /\[ACTION:\s*(\w+)\s*,\s*([\s\S]*?)\]/gi;
                            const matches = Array.from(accumulated.matchAll(actionRegex));

                            for (const match of matches) {
                                const actionString = match[0];
                                if (processedActionsRef.current.has(actionString)) continue;
                                processedActionsRef.current.add(actionString);

                                const actionType = match[1].toLowerCase();
                                const params = match[2].split(',').map(p => p.trim());

                                if (actionType === 'task') {
                                    let title = params[0] || '';
                                    let priority = (params[1] || 'medium').toLowerCase();

                                    // Fix AI hallucination where it swaps priority and title or prepends it
                                    if (['high', 'medium', 'low'].includes(title.toLowerCase())) {
                                        const temp = title.toLowerCase();
                                        title = params[1] || '';
                                        priority = temp;
                                    }

                                    // Remove prepended priority if AI still does it
                                    if (title.toLowerCase().startsWith('high')) title = title.slice(4).trim();
                                    else if (title.toLowerCase().startsWith('medium')) title = title.slice(6).trim();
                                    else if (title.toLowerCase().startsWith('low')) title = title.slice(3).trim();

                                    let taskStage = params[2] ? parseInt(params[2], 10) : (currentStage || 1);
                                    if (isNaN(taskStage) || taskStage > 4) taskStage = currentStage || 4;
                                    if (taskStage < 1) taskStage = 1;

                                    // Robust description: Rejoin in case the description contained commas
                                    const description = params.slice(3).join(', ') || '';

                                    if (!title) continue;

                                    fetch('/api/tasks', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            userId: user.id,
                                            title,
                                            description,
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
                                    if (!useAppStore.getState().lockedUniversityId) {
                                        toast.error("Unlock Stage 4 first!", {
                                            description: "You must lock a university before generating application documents."
                                        });
                                        continue;
                                    }
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
                                    if (uniId && uniId !== 'UNIVERSITY_ID' && !uniId.includes('[ID]')) {
                                        const universityToShortlist = universities.find(u => u.id === uniId);
                                        toggleShortlist(uniId); // Optimistic
                                        fetch('/api/shortlist', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                userId: user.id,
                                                universityId: uniId,
                                                universityData: uniId.startsWith('ext-') ? universityToShortlist : undefined
                                            })
                                        });
                                        toast.success("University Shortlisted");
                                    }
                                } else if (actionType === 'lock') {
                                    const uniId = params[0];
                                    if (uniId && uniId !== 'UNIVERSITY_ID' && !uniId.includes('[ID]')) {
                                        lockUniversity(uniId);
                                        setStage(4);
                                        fetch('/api/shortlist/lock', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ universityId: uniId })
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
                            // Sync state after potential actions
                            await syncAll();
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
    }, [activeSessionId, user.id]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const startNewChat = () => {
        setActiveSessionId(`session_${Date.now()}`);
        setMessages([]);
        setInput('');
    };

    const clearHistory = async () => {
        if (!confirm('Are you sure you want to clear all chat history?')) return;
        try {
            const res = await fetch(`/api/conversations?userId=${user.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSessions([]);
                setMessages([]);
                setActiveSessionId(`session_${Date.now()}`);
                toast.success('History cleared');
            }
        } catch (e) {
            toast.error('Failed to clear history');
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] flex gap-6 w-full max-w-full mx-auto p-2 lg:p-0">
            {/* Premium Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col gap-4 h-full pb-4">
                <div className="space-y-3">
                    <button
                        onClick={startNewChat}
                        className="w-full group relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-black font-black hover:bg-white/90 transition-all duration-300 transform active:scale-[0.97] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                    >
                        <Plus className="h-5 w-5 stroke-[3]" />
                        <span className="text-[13px] uppercase tracking-widest">New Session</span>
                    </button>
                </div>

                {/* Counselor Mode Card */}
                <Card className="p-3.5 bg-[#0D1117] border-white/5 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Counsellor Mode</h4>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {PERSONAS.map((persona) => (
                            <button
                                key={persona.id}
                                onClick={() => setSelectedPersona(persona.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border ${selectedPersona === persona.id
                                    ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                                    }`}
                                title={persona.desc}
                            >
                                <span className={`text-xl mb-1 transition-transform duration-300 ${selectedPersona === persona.id ? 'scale-110' : 'grayscale opacity-50'}`}>{persona.icon}</span>
                                <span className={`text-[9px] font-bold tracking-tighter uppercase ${selectedPersona === persona.id ? 'text-blue-400' : 'text-slate-500'}`}>{persona.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card className="flex-1 bg-[#0D1117] border-white/5 overflow-hidden flex flex-col shadow-2xl">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <History className="h-3.5 w-3.5" /> History
                        </div>
                        <button
                            onClick={clearHistory}
                            className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                            title="Clear All History"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {sessions.length > 0 ? sessions.map((s) => (
                            <button
                                key={s.sessionId}
                                onClick={() => setActiveSessionId(s.sessionId)}
                                className={`group w-full text-left p-3 rounded-lg text-xs flex items-center gap-3 transition-all relative ${activeSessionId === s.sessionId
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300 border border-transparent'
                                    }`}
                            >
                                <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${activeSessionId === s.sessionId ? 'text-blue-400' : 'text-slate-600'}`} />
                                <span className="truncate flex-1 font-medium">{s.title}</span>
                                <div
                                    role="button"
                                    onClick={(e) => deleteSession(s.sessionId, e)}
                                    className="p-1 rounded-md hover:bg-red-500/20 text-slate-600 hover:text-red-400 lg:opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Chat"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </div>
                            </button>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 opacity-20 filter grayscale">
                                <MessageSquare className="h-8 w-8 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">No History</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Profile Context Sidebar Card */}
                <Card className="p-4 bg-[#0D1117] border-white/5 flex flex-col gap-4 shadow-xl">
                    <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Profile Context</h4>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">GPA</span>
                            <span className="text-[10px] font-bold text-slate-300">{user.gpa || 'N/A'} <span className="text-slate-600 font-normal">/ {user.gpaScale || '4.0'}</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Budget</span>
                            <span className="text-[10px] font-bold text-emerald-500/90">${(user.budgetMax || 50000).toLocaleString()} <span className="text-[8px] text-slate-600 lowercase tracking-normal">/yr</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Goal</span>
                            <span className="text-[10px] font-bold text-blue-400/90 truncate max-w-[120px] text-right font-display uppercase tracking-tight">{user.targetField || 'Masters'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Countries</span>
                            <span className="text-[10px] font-bold text-amber-500/90 truncate max-w-[120px] text-right">{user.preferredCountries?.join(', ') || 'Global'}</span>
                        </div>
                        {user.targetIntake && (
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">Intake</span>
                                <span className="text-[10px] font-bold text-indigo-400/90 uppercase tracking-tighter">{user.targetIntake}</span>
                            </div>
                        )}
                    </div>
                </Card>


            </aside>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden bg-[#0A0D12] border-white/5 relative shadow-2xl rounded-none lg:rounded-none h-full min-h-screen lg:min-h-0 lg:h-screen">
                {/* Header */}
                <div className="p-3 lg:p-4 border-b border-white/5 flex items-center justify-between bg-[#0D1117]/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3 flex-1 lg:ml-2">
                        <div className="h-9 w-9 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-100 text-sm lg:text-base tracking-tight truncate">AI Counsellor</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em] whitespace-nowrap">
                                    Active: <span className="text-blue-400/90 font-black">{currentPersona.name}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        <button
                            onClick={clearHistory}
                            className="p-2 lg:p-2.5 rounded-xl bg-slate-800/20 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Clear All History"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                            onClick={toggleCallMode}
                            className={`group px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-bold uppercase relative overflow-hidden ${isCallMode
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/70 ring-1 ring-slate-700/50 hover:ring-slate-600/50 shadow-lg'
                                }`}
                        >
                            {isCallMode && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
                            )}
                            {isCallMode ? <PhoneOff className="h-3.5 w-3.5 lg:h-4 lg:w-4 relative z-10 animate-pulse" /> : <Phone className="h-3.5 w-3.5 lg:h-4 lg:w-4 relative z-10" />}
                            <span className="hidden sm:inline relative z-10">{isCallMode ? 'End Call' : 'Voice Call'}</span>
                        </button>
                        <button
                            onClick={() => {
                                const next = !isSpeechEnabled;
                                setIsSpeechEnabled(next);
                                if (!next) stopSpeaking(); // Stop immediately if muted
                            }}
                            className={`p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl transition-all duration-300 ring-1 ${isSpeechEnabled
                                ? 'text-blue-400 bg-blue-600/20 ring-blue-500/30 hover:bg-blue-600/30 shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 bg-slate-800/50 ring-slate-700/50 hover:bg-slate-700/70 hover:text-slate-400'
                                }`}
                        >
                            {isSpeechEnabled ? <Volume2 className="h-4 w-4 lg:h-5 lg:w-5" /> : <VolumeX className="h-4 w-4 lg:h-5 lg:w-5" />}
                        </button>
                    </div>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar" role="log" aria-live="polite">
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center h-full text-blue-500/50"><div className="h-12 w-12 border-4 border-current border-t-transparent rounded-full animate-spin" /></div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center text-center px-6 md:px-10 gap-10 py-12 lg:py-24 animate-in fade-in zoom-in duration-500">
                            <div className="flex flex-col items-center gap-6 flex-shrink-0">
                                <div className="h-24 w-24 lg:h-32 lg:w-32 rounded-[2.5rem] bg-indigo-600/20 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/20 border border-indigo-500/20 transform hover:rotate-6 transition-all duration-500 flex-shrink-0 z-10">
                                    <Sparkles className="h-12 w-12 lg:h-16 lg:w-16 text-indigo-400 relative z-20 animate-pulse" />
                                </div>
                                <div className="space-y-4 flex-shrink-0 relative z-10">
                                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">Namaste! 👋</h1>
                                    <p className="text-slate-400 max-w-sm mx-auto text-sm lg:text-xl font-medium leading-relaxed">I'm your AI counsellor. Let's start by planning your international career journey.</p>
                                </div>
                            </div>

                            {/* Quick Actions Grid integrated here */}
                            {!isTyping && (
                                <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 flex-shrink-0">
                                    <div className="flex items-center justify-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] px-2">
                                        <div className="h-px w-8 bg-slate-800" />
                                        <Lightbulb className="h-3 w-3 text-blue-400" />
                                        <span>Quick start topics</span>
                                        <div className="h-px w-8 bg-slate-800" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                        {QUICK_ACTIONS.map((action) => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleSend(action.label)}
                                                className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/40 hover:bg-blue-600/10 transition-all text-left group active:scale-[0.98]"
                                            >
                                                <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/20 transition-all">
                                                    <action.icon className="h-6 w-6" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
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
        </div >
    );
}

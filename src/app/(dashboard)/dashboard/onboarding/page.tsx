'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { ConfettiButton } from '@/components/lightswind/confetti-button';
import { ChevronLeft, ChevronRight, Sparkles, MessageSquare, User as UserIcon, Send, Loader2, CheckSquare, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

// Local type for the form, allowing strings for inputs that will be parsed to numbers later
type OnboardingFormData = {
  education: string;
  degree: string;
  gpa: string;
  studyGoal: string;
  preferredCountries: string[];
  budgetMin: string;
  budgetMax: string;
  examStatus: string;
  examScores: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser, completeOnboarding } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<'form' | 'ai'>('form');
  const [aiStep, setAiStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Counsellor. I'll help you set up your profile. What is your current education level? (High School, Bachelors, or Masters?)" }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = async (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined') return;

    // Stop current audio or speech
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    window.speechSynthesis.cancel();

    const cleanSpeechText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[ACTION:.*?\]/g, '')
      .replace(/\[DATA:.*?\]/g, '')
      .replace(/=/g, ' is ')
      .trim();

    if (!cleanSpeechText) return;

    try {
      // 1. Try ElevenLabs via our API
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSpeechText }),
      });

      if (!response.ok) throw new Error('ElevenLabs Failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url); // Clean up memory leak
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      audio.play();
    } catch (e) {
      console.warn('⚠️ ElevenLabs failed or limit reached, falling back to browser TTS');

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setCurrentAudio(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Fixed: Stop talking if user toggles speech OFF manually
  useEffect(() => {
    if (!isSpeechEnabled && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    }
  }, [isSpeechEnabled, currentAudio]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.', {
        description: 'Try using Chrome or Edge for the best experience.'
      });
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
      setAiInput(prev => prev + ' ' + transcript);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isTyping]);

  // Initialize with store data
  const [data, setData] = useState<OnboardingFormData>({
    education: user.education || '',
    degree: user.degree || '',
    gpa: user.gpa || '',
    studyGoal: user.studyGoal || '',
    preferredCountries: user.preferredCountries || [],
    budgetMin: user.budgetMin ? user.budgetMin.toString() : '',
    budgetMax: user.budgetMax ? user.budgetMax.toString() : '',
    examStatus: user.examStatus || '',
    examScores: user.examScores || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (mode === 'ai' && aiMessages.length === 1 && aiMessages[0].role === 'assistant') {
      speak(aiMessages[0].content);
    }
  }, [mode]);

  const updateField = (field: keyof OnboardingFormData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!data.education) newErrors.education = 'Required';
      if (!data.degree) newErrors.degree = 'Required';
      if (!data.gpa) newErrors.gpa = 'Required';
    } else if (step === 1) {
      if (!data.studyGoal) newErrors.studyGoal = 'Required';
      if (data.preferredCountries.length === 0) newErrors.preferredCountries = 'Select at least one country';
    } else if (step === 2) {
      if (!data.budgetMin) newErrors.budgetMin = 'Required';
      if (!data.budgetMax) newErrors.budgetMax = 'Required';
    } else if (step === 3) {
      if (!data.examStatus) newErrors.examStatus = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep(3)) return;

    setIsTyping(true); // Show loading state

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          ...data,
          budgetMin: parseInt(data.budgetMin) || 0,
          budgetMax: parseInt(data.budgetMax) || 0,
          onboardingCompleted: true,
          currentStage: 2,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        completeOnboarding();
        router.push('/dashboard');
      } else {
        toast.error('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleAiSend = async () => {
    if (!aiInput.trim() || isTyping) return;

    const userMessage = aiInput;
    const newMessages = [...aiMessages, { role: 'user', content: userMessage } as Message];
    setAiMessages(newMessages);
    setAiInput('');
    setIsTyping(true);

    const assistantMessageId = Date.now();
    setAiMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true } as any]);

    try {
      const response = await fetch('/api/ai/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: [...aiMessages, { role: 'user', content: userMessage }].map(m => ({ role: m.role, content: m.content })),
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
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              setIsTyping(false);

              // Handle data extraction
              const dataMatch = accumulatedContent.match(/\[DATA:\s*({[^\]]+})\]/);
              if (dataMatch) {
                try {
                  const extractedData = JSON.parse(dataMatch[1]);
                  console.log('Parsed AI Onboarding Data:', extractedData);

                  // Update form data with extracted info
                  setData(prev => ({
                    ...prev,
                    ...extractedData,
                    budgetMax: extractedData.budgetMax?.toString() || prev.budgetMax,
                    preferredCountries: extractedData.preferredCountries || prev.preferredCountries,
                  }));

                  setAiStep(6); // Finalize
                } catch (e) {
                  console.error('Error parsing extracted data:', e);
                }
              }

              const textToSpeak = accumulatedContent.replace(/\[DATA:\s*({[^\]]+})\]/, '').trim();
              speak(textToSpeak);
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setAiMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last.role === 'assistant') {
                    return [...prev.slice(0, -1), { ...last, content: accumulatedContent }];
                  }
                  return prev;
                });
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in AI onboarding call:', error);
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again or switch to form mode.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const steps = [
    {
      title: 'Academic Background',
      description: 'Tell us about your education',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Current Education Level <span className="text-red-500">*</span>
            </label>
            <select
              value={data.education}
              onChange={(e) => updateField('education', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-900/50 border ${errors.education ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50`}
            >
              <option value="">Select education level</option>
              <option value="high-school">High School (12th Grade)</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="other">Other</option>
            </select>
            {errors.education && <p className="mt-1 text-xs text-red-500">{errors.education}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Degree/Major <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Computer Science"
              value={data.degree}
              onChange={(e) => updateField('degree', e.target.value)}
              className={`w-full bg-slate-900/50 ${errors.degree ? 'border-red-500' : 'border-white/10'} text-white`}
            />
            {errors.degree && <p className="mt-1 text-xs text-red-500">{errors.degree}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              GPA / Percentage <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., 3.8 / 85%"
              value={data.gpa}
              onChange={(e) => updateField('gpa', e.target.value)}
              className={`w-full bg-slate-900/50 ${errors.gpa ? 'border-red-500' : 'border-white/10'} text-white`}
            />
            {errors.gpa && <p className="mt-1 text-xs text-red-500">{errors.gpa}</p>}
          </div>
        </div>
      ),
    },
    {
      title: 'Study Goals',
      description: 'What do you want to achieve?',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              What do you want to study? <span className="text-red-500">*</span>
            </label>
            <select
              value={data.studyGoal}
              onChange={(e) => updateField('studyGoal', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-900/50 border ${errors.studyGoal ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50`}
            >
              <option value="">Select study goal</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="certificate">Certificate Program</option>
            </select>
            {errors.studyGoal && <p className="mt-1 text-xs text-red-500">{errors.studyGoal}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Preferred Countries <span className="text-red-500">*</span> (Select multiple)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands'].map((country) => (
                <label key={country} className={`flex items-center space-x-2 p-3 border ${data.preferredCountries.includes(country) ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10'} rounded-lg hover:bg-white/5 cursor-pointer transition-colors`}>
                  <input
                    type="checkbox"
                    checked={data.preferredCountries.includes(country)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...data.preferredCountries, country]
                        : data.preferredCountries.filter(c => c !== country);
                      updateField('preferredCountries', updated);
                    }}
                    className="rounded border-white/20 bg-slate-900 text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-300">{country}</span>
                </label>
              ))}
            </div>
            {errors.preferredCountries && <p className="mt-1 text-xs text-red-500">{errors.preferredCountries}</p>}
          </div>
        </div>
      ),
    },
    {
      title: 'Budget Planning',
      description: 'What is your budget range?',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Minimum Budget (USD per year) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={data.budgetMin}
              onChange={(e) => updateField('budgetMin', e.target.value)}
              className={`w-full bg-slate-900/50 ${errors.budgetMin ? 'border-red-500' : 'border-white/10'} text-white`}
            />
            {errors.budgetMin && <p className="mt-1 text-xs text-red-500">{errors.budgetMin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Maximum Budget (USD per year) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="e.g., 30000"
              value={data.budgetMax}
              onChange={(e) => updateField('budgetMax', e.target.value)}
              className={`w-full bg-slate-900/50 ${errors.budgetMax ? 'border-red-500' : 'border-white/10'} text-white`}
            />
            {errors.budgetMax && <p className="mt-1 text-xs text-red-500">{errors.budgetMax}</p>}
          </div>

          <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 This includes tuition and living costs. We'll match you with universities within your budget.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Exam Readiness',
      description: 'Have you taken any exams?',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Exam Status <span className="text-red-500">*</span>
            </label>
            <select
              value={data.examStatus}
              onChange={(e) => updateField('examStatus', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-900/50 border ${errors.examStatus ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50`}
            >
              <option value="">Select status</option>
              <option value="completed">Completed (have scores)</option>
              <option value="scheduled">Scheduled (date confirmed)</option>
              <option value="planning">Planning to take</option>
              <option value="not-required">Not required</option>
            </select>
            {errors.examStatus && <p className="mt-1 text-xs text-red-500">{errors.examStatus}</p>}
          </div>

          {data.examStatus === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Exam Scores (e.g., IELTS 7.5, GRE 320)
              </label>
              <Input
                type="text"
                placeholder="Enter your scores"
                value={data.examScores}
                onChange={(e) => updateField('examScores', e.target.value)}
                className="w-full bg-slate-900/50 border-white/10 text-white"
              />
            </div>
          )}

          <div className="bg-violet-600/10 border border-violet-600/20 p-4 rounded-lg">
            <p className="text-sm text-violet-400">
              ✨ Common exams: IELTS, TOEFL, GRE, GMAT, SAT, ACT
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative bg-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 mb-4 shadow-lg shadow-blue-600/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              Complete Your Profile
            </h1>
            <p className="text-slate-400">
              Help us understand your goals to provide personalized recommendations
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setMode(mode === 'form' ? 'ai' : 'form')}
                className="px-6 py-2.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-bold flex items-center gap-2 hover:bg-blue-600/20 transition-all shadow-lg"
              >
                {mode === 'form' ? <MessageSquare className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {mode === 'form' ? 'Talk to AI Mentor' : 'Back to Manual Form'}
              </button>

              {mode === 'ai' && (
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className={`px-4 py-2.5 rounded-full border transition-all flex items-center gap-2 ${isSpeechEnabled ? 'bg-violet-600/10 border-violet-600/20 text-violet-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                  title={isSpeechEnabled ? "Voice Enabled" : "Voice Disabled"}
                >
                  {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="text-xs font-bold">{isSpeechEnabled ? 'Voice On' : 'Voice Off'}</span>
                </button>
              )}
            </div>
          </div>

          <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
            {mode === 'form' ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="text-sm font-medium text-blue-400">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2 font-display">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-slate-400">
                    {steps[currentStep].description}
                  </p>
                </div>

                <div className="mb-8 text-slate-200">
                  {steps[currentStep].content}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                  </button>

                  {currentStep < totalSteps - 1 ? (
                    <GradientButton onClick={nextStep} size="lg" gradientColors={['#2563eb', '#8b5cf6']}>
                      Next Step
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </GradientButton>
                  ) : (
                    <ConfettiButton onClick={handleComplete} size="lg">
                      Complete Profile
                      <Sparkles className="ml-2 h-5 w-5" />
                    </ConfettiButton>
                  )}
                </div>
              </>
            ) : (
              <div className="h-[450px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'assistant' ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                        {msg.role === 'assistant' ? <Sparkles className="h-4 w-4 text-white" /> : <UserIcon className="h-4 w-4 text-slate-400" />}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${msg.role === 'assistant'
                        ? 'bg-slate-900/50 text-slate-200 border border-white/5 rounded-tl-sm'
                        : 'bg-blue-600 text-white rounded-tr-sm'
                        }`}>
                        {msg.content.replace(/\[DATA:\s*({[^\]]+})\]/, '').trim()}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border bg-blue-600 border-blue-500">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-slate-900/50 border border-white/5 rounded-tl-sm">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-auto">
                  {aiStep < 6 ? (
                    <div className="relative">
                      <Input
                        placeholder={isTyping ? "AI is thinking..." : "Type your answer..."}
                        value={aiInput}
                        disabled={isTyping}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                        className="w-full pl-4 pr-24 py-6 bg-slate-950/50 border-white/10 text-white focus:border-blue-500/50 transition-colors"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                        <button
                          onClick={startListening}
                          disabled={isTyping}
                          className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={handleAiSend}
                          disabled={!aiInput.trim() || isTyping}
                          className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                        >
                          {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Profile Synchronized!</p>
                          <p className="text-green-400/80">We've updated your goals based on our conversation.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => { setMode('form'); setCurrentStep(0); }}
                          className="flex-1 py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all flex items-center justify-center gap-2 border border-white/5"
                        >
                          Review & Edit Details
                        </button>
                        <ConfettiButton onClick={handleComplete} className="flex-[2] py-4 text-lg">
                          Enter Mission Control
                          <ChevronRight className="ml-2 h-6 w-6" />
                        </ConfettiButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
}

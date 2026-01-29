'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppStore, University } from '@/lib/store';
import {
  Heart,
  MapPin,
  DollarSign,
  TrendingUp,
  Filter,
  Star,
  Globe,
  Lock,
  Check,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { Input } from '@/components/lightswind/input';
import { MatchCategory } from '@/lib/matchUtils';

const categoryColors: Record<MatchCategory, string> = {
  Dream: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Target: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const UniversityCard = memo(({
  uni,
  isShortlisted,
  isLocked,
  isLoading,
  lockedUniversityId,
  handleShortlistToggle,
  handleLock,
  handleUnlock
}: {
  uni: University;
  isShortlisted: boolean;
  isLocked: boolean;
  isLoading: boolean;
  lockedUniversityId: string | null;
  handleShortlistToggle: (id: string) => void;
  handleLock: (id: string) => void;
  handleUnlock: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const category = uni.tags.find(t => ['Dream', 'Target', 'Safe'].includes(t)) || 'Target';

  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all group relative ${isLocked ? 'border-emerald-500/50 bg-emerald-950/10' : 'hover:border-slate-600'}`}
    >
      {isLocked && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg shadow-emerald-500/20">
          <Check className="h-3 w-3" /> LOCKED CHOICE
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-14 w-14 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner group-hover:border-blue-500/30 transition-colors">
            {uni.domain && !imageError ? (
              <div className="relative w-10 h-10">
                <Image
                  src={`https://logo.clearbit.com/${uni.domain}`}
                  alt={uni.name}
                  fill
                  sizes="40px"
                  className="object-contain brightness-110 contrast-110"
                  loading="lazy"
                  unoptimized={true}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center font-display font-bold text-xl text-blue-400">
                {uni.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight"
                title={uni.name}
              >
                {uni.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{uni.location}, {uni.country}</span>
              <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] uppercase tracking-tighter font-bold border flex-shrink-0 ${categoryColors[category as MatchCategory] || categoryColors['Target']}`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {!isLocked && (
          <button
            onClick={() => handleShortlistToggle(uni.id)}
            disabled={isLoading}
            className="ml-4 p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <Heart
              className={`h-6 w-6 transition-all ${isShortlisted
                ? 'fill-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-blue-600'
                } ${isLoading ? 'animate-pulse' : ''}`}
            />
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Match Score</span>
          <span className="text-sm font-bold text-emerald-400">
            {uni.matchScore}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            style={{ width: `${uni.matchScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Tuition</p>
            <p className="text-sm font-medium text-slate-200">${uni.tuition.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Acceptance</p>
            <p className="text-sm font-medium text-slate-200">{uni.acceptanceRate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Rank</p>
            <p className="text-sm font-medium text-slate-200">#{uni.rank || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Program</p>
            <p className="text-sm font-medium text-slate-200 truncate w-32">{uni.programs[0]}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {uni.strengths && uni.strengths.length > 0 && (
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Strengths / Why it fits</p>
            <p className="text-xs text-slate-300 line-clamp-2">{uni.strengths.join(' • ')}</p>
          </div>
        )}
        {uni.risks && uni.risks.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Potential Risks</p>
            <p className="text-xs text-slate-300 line-clamp-2">{uni.risks.join(' • ')}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all text-center border border-white/5 active:scale-[0.98]"
          >
            View Website
          </a>
        )}

        {isLocked ? (
          <button
            onClick={handleUnlock}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 active:scale-[0.98]"
          >
            Unlock Selection
          </button>
        ) : (
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => handleShortlistToggle(uni.id)}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border active:scale-[0.98] ${isShortlisted
                ? 'border-blue-600/30 text-blue-400 bg-blue-600/10 hover:bg-blue-600/20'
                : 'border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 bg-slate-900/50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? '...' : isShortlisted ? 'Shortlisted' : 'Shortlist'}
            </button>

            {isShortlisted && !lockedUniversityId && (
              <button
                onClick={() => handleLock(uni.id)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Lock className="h-4 w-4" />
                Lock
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

UniversityCard.displayName = 'UniversityCard';

export default function UniversitiesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [source, setSource] = useState<'database' | 'rag'>('rag');
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistLoading, setShortlistLoading] = useState<string | null>(null);
  const {
    user,
    shortlistedIds,
    lockedUniversityId,
    setShortlistedIds,
    lockUniversity,
    unlockUniversity,
    setStage,
    setUniversities: setGlobalUniversities
  } = useAppStore();

  useEffect(() => {
    fetchUniversities();
  }, [source, user.email || '', user.gpa, user.budgetMax]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('userEmail', user.email || '');
      if (source === 'rag') {
        params.append('rag', 'true');
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/universities?${params.toString()}`);
      const data = await response.json();
      setUniversities(data);
      setGlobalUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUniversities();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    if (searchQuery === '') {
      fetchUniversities();
    }
  }, [searchQuery]);

  const handleShortlistToggle = async (universityId: string) => {
    if (!user.id) {
      toast.error('Please complete your profile first');
      router.push('/dashboard/profile');
      return;
    }

    setShortlistLoading(universityId);

    try {
      const universityToShortlist = universities.find(u => u.id === universityId);
      const response = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          universityId,
          universityData: universityId.startsWith('ext-') ? universityToShortlist : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.action === 'added') {
          setShortlistedIds([...shortlistedIds, universityId]);
          if (data.newStage) setStage(data.newStage);
          toast.success(`${data.shortlist.university.name} shortlisted!`, {
            description: `${data.tasksCreated} specialized tasks have been added to your list.`
          });
        } else {
          setShortlistedIds(shortlistedIds.filter(id => id !== universityId));
          toast.info('Removed from shortlist');
        }
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      toast.error('Failed to update shortlist. Please try again.');
    } finally {
      setShortlistLoading(null);
    }
  };

  const handleLock = async (id: string) => {
    if (!confirm('Are you sure you want to lock this university? This will move you to the Application phase.')) {
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          lockedUniversityId: id,
          currentStage: 4,
        }),
      });

      if (response.ok) {
        lockUniversity(id);
        const uniName = universities.find(u => u.id === id)?.name || 'University';
        toast.success(`${uniName} Locked!`, {
          description: "Moving you to the Application phase. Good luck!"
        });

        setTimeout(() => {
          setStage(4);
          router.push('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Error locking university:', error);
    }
  };

  const handleUnlock = async () => {
    if (!confirm('Are you sure you want to unlock this university? Your current application progress and guidance will be reset, and you will be returned to the Research phase.')) {
      return;
    }
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          lockedUniversityId: null,
          currentStage: 3,
        }),
      });

      if (response.ok) {
        unlockUniversity();
        setStage(3);
      }
    } catch (error) {
      console.error('Error unlocking university:', error);
    }
  };

  const filteredUniversities = universities.filter(uni => {
    const isShortlisted = shortlistedIds.includes(uni.id);
    if (filter === 'all') return true;
    if (filter === 'shortlisted') return isShortlisted;
    const upperTags = uni.tags.map(t => t.toUpperCase());
    if (filter === 'dream') return upperTags.includes('DREAM');
    if (filter === 'target') return upperTags.includes('TARGET');
    if (filter === 'safe') return upperTags.includes('SAFE');
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            University Recommendations
          </h1>
          <p className="text-slate-400">
            {source === 'rag' ? 'AI-powered semantic search' : 'Database search'} • {shortlistedIds.length} shortlisted
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <span className="font-medium text-slate-300">Search Mode:</span>
          <div className="flex gap-2">
            {[
              { value: 'rag', label: 'AI-Powered (RAG)', icon: Sparkles },
              { value: 'database', label: 'Standard Search', icon: Search },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSource(option.value as 'database' | 'rag')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${source === option.value
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search universities by name, location, or programs..."
              className="w-full bg-slate-950/50 border-white/10 text-white pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="h-5 w-5 text-slate-400" />
          <span className="font-medium text-slate-300">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Universities' },
              { value: 'dream', label: 'Dream' },
              { value: 'target', label: 'Target' },
              { value: 'safe', label: 'Safe' },
              { value: 'shortlisted', label: 'Shortlisted' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === option.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
            {source === 'rag' ? 'AI is analyzing your profile and searching universities...' : 'Loading universities...'}
          </p>
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-slate-500">No universities match your filter.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredUniversities.map((uni) => (
            <UniversityCard
              key={uni.id}
              uni={uni}
              isShortlisted={shortlistedIds.includes(uni.id)}
              isLocked={lockedUniversityId === uni.id}
              isLoading={shortlistLoading === uni.id}
              lockedUniversityId={lockedUniversityId}
              handleShortlistToggle={handleShortlistToggle}
              handleLock={handleLock}
              handleUnlock={handleUnlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

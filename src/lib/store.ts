
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserProfile = {
  name: string;
  email: string;
  education: string;
  degree: string;
  gpa: string;
  studyGoal: string; // Bachelors, Masters, etc.
  targetField: string; // CS, Business, etc. (derived from degree usually)
  preferredCountries: string[];
  budgetMin: number;
  budgetMax: number;
  examStatus: string;
  examScores: string;
  fundingPlan?: string;
  sopStatus?: string;
  targetIntake?: string;
  onboardingCompleted: boolean;
  avatar?: string;
};

export type University = {
  id: string;
  name: string;
  location: string;
  country: string;
  rank: number | null;
  tuition: number;
  acceptanceRate: string;
  matchScore: number;
  tags: string[];
  programs: string[];
  description: string;
  risks: string[];
  strengths: string[];
  website?: string;
  domain?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due: string;
  stage: number;
};

export type AppStage = 1 | 2 | 3 | 4;
// 1: Profile Building
// 2: Discovery Phase
// 3: Finalizing (Locking)
// 4: Application Prep

interface AppState {
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Auth
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // User Profile
  user: UserProfile & { id?: string };
  updateUser: (data: Partial<UserProfile & { id?: string }>) => void;
  completeOnboarding: () => void;

  // App Stage
  currentStage: AppStage;
  setStage: (stage: AppStage) => void;

  // Universities
  universities: University[];
  shortlistedIds: string[];
  lockedUniversityId: string | null;
  setUniversities: (universities: University[]) => void;
  setShortlistedIds: (ids: string[]) => void;
  toggleShortlist: (id: string) => void;
  lockUniversity: (id: string) => void;
  unlockUniversity: () => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;

  // Computed helpers (not state, but accessible via getters if needed, here we just keep state)
  reset: () => void;
}

const INITIAL_USER: UserProfile = {
  name: 'Student', // Default
  email: '',
  education: '',
  degree: '',
  gpa: '',
  studyGoal: '',
  targetField: '',
  preferredCountries: [],
  budgetMin: 0,
  budgetMax: 0,
  examStatus: '',
  examScores: '',
  fundingPlan: '',
  sopStatus: '',
  targetIntake: '',
  onboardingCompleted: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({
        isAuthenticated: false,
        user: INITIAL_USER,
        currentStage: 1,
        shortlistedIds: [],
        lockedUniversityId: null,
        tasks: []
      }),

      user: INITIAL_USER,
      currentStage: 1,
      universities: [],
      shortlistedIds: [],
      lockedUniversityId: null,
      tasks: [],

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      completeOnboarding: () => set((state) => ({
        user: { ...state.user, onboardingCompleted: true },
        currentStage: 2 // Move to discovery automatically
      })),

      setStage: (stage) => set({ currentStage: stage }),

      setUniversities: (universities) => set({ universities }),

      setShortlistedIds: (ids) => set({ shortlistedIds: ids }),

      toggleShortlist: (id) => set((state) => {
        const isShortlisted = state.shortlistedIds.includes(id);
        const newList = isShortlisted
          ? state.shortlistedIds.filter(sid => sid !== id)
          : [...state.shortlistedIds, id];

        // Auto-update stage if we have a shortlist and are in stage 2
        let newStage = state.currentStage;
        if (state.currentStage === 2 && newList.length >= 1) {
          // Just a visual cue, strictly speaking stage 3 is decision time
        }

        return { shortlistedIds: newList };
      }),

      lockUniversity: (id) => set((state) => ({
        lockedUniversityId: id,
        currentStage: 4, // Jump to Application Prep
        // Add specific tasks for this uni could go here
      })),

      unlockUniversity: () => set({
        lockedUniversityId: null,
        currentStage: 3 // Back to finalizing
      }),

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) => set((state) => {
        if (state.tasks.some(t => t.id === task.id)) return state;
        return { tasks: [...state.tasks, task] };
      }),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      })),

      reset: () => set({
        user: INITIAL_USER,
        currentStage: 1,
        shortlistedIds: [],
        lockedUniversityId: null,
        tasks: []
      }),
    }),
    {
      name: 'ai-counsellor-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      }
    }
  )
);

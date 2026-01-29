import { prisma } from './prisma';

interface UserProfile {
  gpa?: string | null;
  budgetMin?: number;
  budgetMax?: number;
  preferredCountries?: string[];
  studyGoal?: string | null;
  targetField?: string | null;
  examScores?: string | null;
}

export async function recalculateUniversityMatches(userId: string) {
  // We no longer update the matchScore field in the global University table 
  // because it would cause global data corruption when multiple users exist.
  // Match scores are calculated on-the-fly in the GET /api/universities route.
  console.log(`ℹ️ [Matches] Skipping persistent DB update for user ${userId} to avoid global data corruption.`);
}

export function calculateMatchScore(user: UserProfile, university: any): number {
  let score = 0;

  const gpaValue = parseFloat(user.gpa || '0');
  const userBudgetMax = user.budgetMax || 0;

  if (gpaValue >= 3.8 && university.rank && university.rank <= 10) {
    score += 30;
  } else if (gpaValue >= 3.5 && university.rank && university.rank <= 50) {
    score += 25;
  } else if (gpaValue >= 3.0 && university.rank && university.rank <= 100) {
    score += 20;
  } else {
    score += 10;
  }

  if (userBudgetMax >= university.tuition) {
    score += 25;
  } else if (userBudgetMax >= university.tuition * 0.8) {
    score += 15;
  } else if (userBudgetMax >= university.tuition * 0.5) {
    score += 5;
  }

  if (user.preferredCountries && user.preferredCountries.includes(university.country)) {
    score += 15;
  }

  const acceptanceRate = parseFloat(university.acceptanceRate?.replace('%', '') || '100');
  if (acceptanceRate >= 30) {
    score += 15;
  } else if (acceptanceRate >= 10) {
    score += 10;
  } else {
    score += 5;
  }

  if (user.targetField && university.programs) {
    const hasMatchingProgram = university.programs.some((program: string) =>
      program.toLowerCase().includes(user.targetField!.toLowerCase())
    );
    if (hasMatchingProgram) {
      score += 15;
    }
  }

  return Math.min(100, score);
}

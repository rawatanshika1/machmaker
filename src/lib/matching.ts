import { Customer } from '@/types/customer';

function ageFromDob(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function scoreLifestyle(a: Customer, b: Customer): number {
  let score = 0;
  let maxScore = 0;

  // Relocation compatibility (15 points)
  if (a.openToRelocate === b.openToRelocate) score += 15;
  maxScore += 15;

  // Pet preferences (15 points)
  if (a.openToPets === b.openToPets) score += 15;
  maxScore += 15;

  // Diet preference (15 points)
  if (a.dietPreference === b.dietPreference) score += 15;
  maxScore += 15;

  // Manglik status (10 points)
  if (a.manglikStatus === b.manglikStatus) score += 10;
  maxScore += 10;

  // Family type (10 points)
  if (a.familyType === b.familyType) score += 10;
  maxScore += 10;

  // Common habits (15 points max)
  const commonHabits = a.habits.filter((habit) => b.habits.includes(habit)).length;
  score += Math.min(commonHabits * 6, 15);
  maxScore += 15;

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function scoreCareer(a: Customer, b: Customer): number {
  let score = 0;
  let maxScore = 0;

  // Same company (10 points)
  if (a.company === b.company) score += 10;
  maxScore += 10;

  // Same designation (10 points)
  if (a.designation === b.designation) score += 10;
  maxScore += 10;

  // Income compatibility (10 points) - within 150k
  if (Math.abs(a.income - b.income) < 150000) score += 10;
  maxScore += 10;

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function scoreFamilyGoals(a: Customer, b: Customer): number {
  let score = 0;
  let maxScore = 0;

  // Want kids alignment (20 points)
  if (a.wantKids === b.wantKids) score += 20;
  maxScore += 20;

  // Religion match (10 points)
  if (a.religion === b.religion) score += 10;
  maxScore += 10;

  // Caste match (10 points)
  if (a.caste === b.caste) score += 10;
  maxScore += 10;

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function scoreValues(a: Customer, b: Customer): number {
  let score = 0;
  let maxScore = 0;

  // Religion match (20 points)
  if (a.religion === b.religion) score += 20;
  maxScore += 20;

  // Caste match (15 points)
  if (a.caste === b.caste) score += 15;
  maxScore += 15;

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export function getCompatibilityScore(customer: Customer, candidate: Customer): number {
  const valuesScore = scoreValues(customer, candidate);
  const lifestyleScore = scoreLifestyle(customer, candidate);
  const careerScore = scoreCareer(customer, candidate);
  const familyGoalsScore = scoreFamilyGoals(customer, candidate);

  // Weighted average: Values 30%, Lifestyle 25%, Career 25%, Family 20%
  const weightedScore =
    valuesScore * 0.3 + lifestyleScore * 0.25 + careerScore * 0.25 + familyGoalsScore * 0.2;

  return Math.round(Math.min(100, Math.max(0, weightedScore)));
}

export function getMatchInsights(customer: Customer, candidate: Customer) {
  const values = scoreValues(customer, candidate);
  const lifestyle = scoreLifestyle(customer, candidate);
  const career = scoreCareer(customer, candidate);
  const familyGoals = scoreFamilyGoals(customer, candidate);

  return {
    values,
    lifestyle,
    career,
    familyGoals,
  };
}

export function getTopMatches(customer: Customer, pool: Customer[]) {
  const candidates = pool.filter((candidate) => candidate.id !== customer.id && candidate.gender !== customer.gender);
  return candidates
    .map((candidate) => ({ candidate, score: getCompatibilityScore(customer, candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

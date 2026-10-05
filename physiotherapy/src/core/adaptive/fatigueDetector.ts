export interface FatigueEvaluationInput {
  baselineVelocityDegPerSec: number;
  currentVelocityDegPerSec: number;
  baselineNormalizedJerk: number;
  currentNormalizedJerk: number;
  bilateralAsymmetryPercent: number;
}

export interface FatigueEvaluationResult {
  fatigueScore: number; // 0 - 100
  isFatigued: boolean;
  requiresRest: boolean;
  restDurationSec: number;
  primaryContributor: 'VELOCITY_DECAY' | 'TREMOR_JERK' | 'ASYMMETRY_DRIFT' | 'NONE';
}

export function evaluateBiomechanicalFatigue(input: FatigueEvaluationInput): FatigueEvaluationResult {
  // 1. Velocity Drop (up to 40 pts)
  const velRatio = input.baselineVelocityDegPerSec > 0
    ? (input.baselineVelocityDegPerSec - input.currentVelocityDegPerSec) / input.baselineVelocityDegPerSec
    : 0;
  const velocityScore = Math.max(0, Math.min(40, velRatio * 100 * 0.4));

  // 2. Tremor / Jerk Spike (up to 35 pts)
  const jerkRatio = input.baselineNormalizedJerk > 0
    ? input.currentNormalizedJerk / input.baselineNormalizedJerk
    : 1;
  const jerkScore = jerkRatio > 2.0 ? Math.min(35, (jerkRatio - 1.0) * 17.5) : 0;

  // 3. Asymmetry Drift (up to 25 pts)
  const asymmetryScore = Math.min(25, (input.bilateralAsymmetryPercent / 20) * 25);

  const totalFatigue = Math.min(100, Math.round(velocityScore + jerkScore + asymmetryScore));
  const isFatigued = totalFatigue >= 55;

  let contributor: FatigueEvaluationResult['primaryContributor'] = 'NONE';
  if (velocityScore >= jerkScore && velocityScore >= asymmetryScore && velocityScore > 15) {
    contributor = 'VELOCITY_DECAY';
  } else if (jerkScore > velocityScore && jerkScore >= asymmetryScore && jerkScore > 15) {
    contributor = 'TREMOR_JERK';
  } else if (asymmetryScore > 15) {
    contributor = 'ASYMMETRY_DRIFT';
  }

  return {
    fatigueScore: totalFatigue,
    isFatigued,
    requiresRest: isFatigued,
    restDurationSec: isFatigued ? (totalFatigue > 75 ? 120 : 60) : 0,
    primaryContributor: contributor,
  };
}

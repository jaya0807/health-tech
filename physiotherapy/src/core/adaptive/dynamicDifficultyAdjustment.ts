export interface SessionPerformanceRecord {
  sessionId: string;
  averageMqs: number;
  averagePainVas: number;
  completedRepFraction: number; // 0.0 - 1.0
}

export interface DdaEvaluationInput {
  currentStageTier: number; // 1 to 5
  currentTargetAngleDeg: number;
  currentTargetReps: number;
  maxAnatomicalLimitDeg: number;
  sessionHistory: SessionPerformanceRecord[];
}

export interface DdaEvaluationResult {
  action: 'PROMOTE' | 'MAINTAIN' | 'REGRESS';
  newStageTier: number;
  newTargetAngleDeg: number;
  newTargetReps: number;
  clinicalRationale: string;
}

export function evaluateProgressiveDifficulty(input: DdaEvaluationInput): DdaEvaluationResult {
  const history = input.sessionHistory;
  if (history.length === 0) {
    return {
      action: 'MAINTAIN',
      newStageTier: input.currentStageTier,
      newTargetAngleDeg: input.currentTargetAngleDeg,
      newTargetReps: input.currentTargetReps,
      clinicalRationale: 'Initial baseline session established. Maintaining current prescription.',
    };
  }

  const latest = history[history.length - 1];

  // Regression check: severe drop in MQS or spike in pain
  if (latest.averagePainVas >= 5.0 || latest.averageMqs < 60.0) {
    const regressedAngle = Math.max(30, input.currentTargetAngleDeg - 5);
    const regressedReps = Math.max(5, input.currentTargetReps - 2);
    const regressedTier = Math.max(1, input.currentStageTier - 1);

    return {
      action: 'REGRESS',
      newStageTier: regressedTier,
      newTargetAngleDeg: regressedAngle,
      newTargetReps: regressedReps,
      clinicalRationale: `Safety regression triggered due to elevated pain (${latest.averagePainVas}/10) or low MQS (${latest.averageMqs}%).`,
    };
  }

  // Promotion check: 3 consecutive high-quality, low-pain sessions
  const last3 = history.slice(-3);
  const qualifiesForPromotion =
    last3.length >= 3 &&
    last3.every((s) => s.averageMqs >= 85.0 && s.averagePainVas <= 2.0 && s.completedRepFraction >= 0.9);

  if (qualifiesForPromotion) {
    const promotedAngle = Math.min(input.maxAnatomicalLimitDeg, input.currentTargetAngleDeg + 5);
    const promotedReps = input.currentTargetReps + 2;
    const promotedTier = Math.min(5, input.currentStageTier + 1);

    return {
      action: 'PROMOTE',
      newStageTier: promotedTier,
      newTargetAngleDeg: promotedAngle,
      newTargetReps: promotedReps,
      clinicalRationale: 'Promoted to next recovery milestone following 3 consecutive high-fidelity sessions.',
    };
  }

  return {
    action: 'MAINTAIN',
    newStageTier: input.currentStageTier,
    newTargetAngleDeg: input.currentTargetAngleDeg,
    newTargetReps: input.currentTargetReps,
    clinicalRationale: 'Patient progressing steadily. Maintaining current prescription for tissue remodeling.',
  };
}

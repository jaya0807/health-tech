import { MotionQualityBreakdown } from './types.js';

export interface MqsInput {
  actualPeakAngle: number;
  targetAngle: number;
  centerOfMassDriftMm: number;
  normalizedJerk: number;
  leftRightAngleVarianceDeg: number;
}

const WEIGHTS = {
  ACCURACY: 0.35,
  BALANCE: 0.25,
  SMOOTHNESS: 0.20,
  SYMMETRY: 0.20,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculates Range of Motion (ROM) accuracy score (0-100).
 */
export function calculateAccuracyScore(actual: number, target: number): number {
  if (target <= 0) return 100;
  const delta = Math.abs(actual - target);
  const percentageError = (delta / target) * 100;
  return clamp(100 - percentageError);
}

/**
 * Calculates Balance / Center-of-Mass stability score (0-100).
 */
export function calculateBalanceScore(driftMm: number, maxTolerableDriftMm = 50): number {
  const penalty = (Math.abs(driftMm) / maxTolerableDriftMm) * 100;
  return clamp(100 - penalty);
}

/**
 * Calculates Smoothness score based on normalized jerk cost (0-100).
 */
export function calculateSmoothnessScore(normalizedJerk: number, decayLambda = 0.005): number {
  const score = 100 * Math.exp(-decayLambda * Math.abs(normalizedJerk));
  return clamp(score);
}

/**
 * Calculates Bilateral Symmetry score (0-100).
 */
export function calculateSymmetryScore(leftAngle: number, rightAngle: number): number {
  const maxAngle = Math.max(Math.abs(leftAngle), Math.abs(rightAngle));
  if (maxAngle === 0) return 100;
  const diff = Math.abs(leftAngle - rightAngle);
  return clamp(100 - (diff / maxAngle) * 100);
}

/**
 * Computes 4D Composite Motion Quality Score (MQS).
 */
export function computeCompositeMqs(input: MqsInput): MotionQualityBreakdown {
  const accuracy = calculateAccuracyScore(input.actualPeakAngle, input.targetAngle);
  const balance = calculateBalanceScore(input.centerOfMassDriftMm);
  const smoothness = calculateSmoothnessScore(input.normalizedJerk);
  const symmetry = clamp(100 - input.leftRightAngleVarianceDeg * 5);

  const composite =
    accuracy * WEIGHTS.ACCURACY +
    balance * WEIGHTS.BALANCE +
    smoothness * WEIGHTS.SMOOTHNESS +
    symmetry * WEIGHTS.SYMMETRY;

  return {
    accuracyScore: Number(accuracy.toFixed(1)),
    balanceScore: Number(balance.toFixed(1)),
    smoothnessScore: Number(smoothness.toFixed(1)),
    symmetryScore: Number(symmetry.toFixed(1)),
    compositeMqs: Number(clamp(composite).toFixed(1)),
  };
}

import { KinematicHistoryFrame } from './types.js';

export interface DerivativeResult {
  velocityDegPerSec: number;
  accelerationDegPerSec2: number;
  jerk: number;
}

/**
 * Calculates instantaneous angular velocity, acceleration, and jerk given two time-ordered frames.
 */
export function calculateKinematicDerivatives(
  current: { angleDegrees: number; timestampMs: number },
  previous: { angleDegrees: number; timestampMs: number; velocityDegPerSec?: number; acceleration?: number }
): DerivativeResult {
  const deltaT = (current.timestampMs - previous.timestampMs) / 1000.0;

  if (deltaT <= 0 || deltaT > 1.0) {
    return { velocityDegPerSec: 0, accelerationDegPerSec2: 0, jerk: 0 };
  }

  const deltaAngle = current.angleDegrees - previous.angleDegrees;
  const currentVelocity = deltaAngle / deltaT;

  const prevVelocity = previous.velocityDegPerSec ?? 0;
  const currentAcceleration = (currentVelocity - prevVelocity) / deltaT;

  const prevAcceleration = previous.acceleration ?? 0;
  const currentJerk = (currentAcceleration - prevAcceleration) / deltaT;

  return {
    velocityDegPerSec: currentVelocity,
    accelerationDegPerSec2: currentAcceleration,
    jerk: currentJerk,
  };
}

/**
 * Computes mean jerk across a sliding window of historical kinematic frames.
 */
export function calculateNormalizedJerkMetric(frames: KinematicHistoryFrame[]): number {
  if (frames.length < 2) return 0;

  const totalJerkSquared = frames.reduce((acc, frame) => acc + Math.pow(frame.jerk, 2), 0);
  return Math.sqrt(totalJerkSquared / frames.length);
}

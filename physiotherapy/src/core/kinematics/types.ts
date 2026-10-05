export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Landmark3D extends Point3D {
  visibility: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type JointKey =
  | 'LEFT_KNEE'
  | 'RIGHT_KNEE'
  | 'LEFT_SHOULDER'
  | 'RIGHT_SHOULDER'
  | 'LEFT_ELBOW'
  | 'RIGHT_ELBOW'
  | 'LEFT_HIP'
  | 'RIGHT_HIP'
  | 'TRUNK_TILT';

export interface JointAngleResult {
  joint: JointKey;
  angleDegrees: number;
  isValid: boolean;
  confidence: number;
}

export interface MotionQualityBreakdown {
  accuracyScore: number;
  balanceScore: number;
  smoothnessScore: number;
  symmetryScore: number;
  compositeMqs: number;
}

export interface KinematicHistoryFrame {
  timestampMs: number;
  angleDegrees: number;
  velocityDegPerSec: number;
  jerk: number;
}

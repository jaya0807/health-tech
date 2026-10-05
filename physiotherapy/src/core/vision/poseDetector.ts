import { Landmark3D } from '../kinematics/types.js';

export const MEDIAPIPE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

export interface RawPoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export class PoseDataValidator {
  private minConfidence: number;

  constructor(minConfidence = 0.65) {
    this.minConfidence = minConfidence;
  }

  public extractLandmark(landmarks: RawPoseLandmark[], index: number): Landmark3D | null {
    const raw = landmarks[index];
    if (!raw) return null;

    const visibility = raw.visibility ?? 1.0;
    if (visibility < this.minConfidence) {
      return null;
    }

    return {
      x: raw.x,
      y: raw.y,
      z: raw.z ?? 0,
      visibility,
    };
  }

  public areLandmarksReliable(landmarks: RawPoseLandmark[], indices: number[]): boolean {
    return indices.every((idx) => {
      const lm = this.extractLandmark(landmarks, idx);
      return lm !== null;
    });
  }
}

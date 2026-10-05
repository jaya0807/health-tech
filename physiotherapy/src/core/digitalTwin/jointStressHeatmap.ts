export interface JointStressInput {
  jointAngleDeg: number;
  angularAccelerationDegPerSec2: number;
  segmentMassKg: number;
  segmentLengthM: number;
  maxAllowableTorqueNm?: number;
}

export interface JointStressResult {
  torqueNm: number;
  normalizedStress: number; // 0.0 - 1.0
  stressTier: 'LOW' | 'NORMAL' | 'ELEVATED' | 'HIGH';
  heatmapColor: string;
}

export function calculateJointStress(input: JointStressInput): JointStressResult {
  const g = 9.81;
  const rad = (input.jointAngleDeg * Math.PI) / 180.0;
  const radAcc = (input.angularAccelerationDegPerSec2 * Math.PI) / 180.0;

  // Moment of inertia for slender rod rotated about end: I = (1/3) * m * L^2
  const inertia = (1 / 3) * input.segmentMassKg * Math.pow(input.segmentLengthM, 2);
  const gravitationalTorque = input.segmentMassKg * g * (input.segmentLengthM / 2) * Math.sin(rad);
  const dynamicTorque = inertia * radAcc;

  const totalTorque = Math.abs(gravitationalTorque + dynamicTorque);
  const maxTorque = input.maxAllowableTorqueNm ?? 45.0;
  const normalizedStress = Math.min(1.0, totalTorque / maxTorque);

  let stressTier: JointStressResult['stressTier'] = 'LOW';
  let heatmapColor = '#27272a'; // Calm Blue

  if (normalizedStress >= 0.85) {
    stressTier = 'HIGH';
    heatmapColor = '#ef4444'; // Acute Ruby
  } else if (normalizedStress >= 0.6) {
    stressTier = 'ELEVATED';
    heatmapColor = '#f59e0b'; // Amber Warning
  } else if (normalizedStress >= 0.3) {
    stressTier = 'NORMAL';
    heatmapColor = '#10b981'; // Bio-Emerald
  }

  return {
    torqueNm: Number(totalTorque.toFixed(2)),
    normalizedStress: Number(normalizedStress.toFixed(3)),
    stressTier,
    heatmapColor,
  };
}

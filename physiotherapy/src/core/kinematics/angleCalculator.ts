import { Landmark3D, Point3D, Vector3D } from './types.js';

export function createVector(from: Point3D, to: Point3D): Vector3D {
  return {
    x: to.x - from.x,
    y: to.y - from.y,
    z: to.z - from.z,
  };
}

export function dotProduct(u: Vector3D, v: Vector3D): number {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function vectorMagnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Calculates the 3D angle formed at vertex B between rays BA and BC in degrees [0, 180].
 */
export function calculate3DAngle(a: Point3D, b: Point3D, c: Point3D): number {
  const u = createVector(b, a);
  const v = createVector(b, c);

  const magU = vectorMagnitude(u);
  const magV = vectorMagnitude(v);

  if (magU === 0 || magV === 0) {
    return 0;
  }

  const cosine = dotProduct(u, v) / (magU * magV);
  const clampedCosine = Math.max(-1.0, Math.min(1.0, cosine));

  return (Math.acos(clampedCosine) * 180) / Math.PI;
}

/**
 * Computes Knee Flexion angle: Hip -> Knee (vertex) -> Ankle
 */
export function calculateKneeAngle(hip: Landmark3D, knee: Landmark3D, ankle: Landmark3D): number {
  return calculate3DAngle(hip, knee, ankle);
}

/**
 * Computes Elbow Flexion angle: Shoulder -> Elbow (vertex) -> Wrist
 */
export function calculateElbowAngle(shoulder: Landmark3D, elbow: Landmark3D, wrist: Landmark3D): number {
  return calculate3DAngle(shoulder, elbow, wrist);
}

/**
 * Computes Trunk Lateral Tilt relative to vertical Y-axis
 */
export function calculateTrunkTilt(leftShoulder: Landmark3D, rightShoulder: Landmark3D): number {
  const dx = rightShoulder.x - leftShoulder.x;
  const dy = rightShoulder.y - leftShoulder.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

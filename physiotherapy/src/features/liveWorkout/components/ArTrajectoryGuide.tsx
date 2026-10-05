import { Point3D } from '../../../core/kinematics/types.js';

export interface ArTrajectoryProps {
  originJoint: Point3D;
  distalJoint: Point3D;
  targetAngleDegrees: number;
  limbLengthPx: number;
}

/**
 * Calculates ghost holographic guide path for visual proprioception feedback.
 */
export function calculateGhostTrajectoryPath(
  origin: Point3D,
  currentDistal: Point3D,
  targetAngle: number,
  lengthPx: number
) {
  const targetRad = (targetAngle * Math.PI) / 180.0;
  const targetDistalX = origin.x + Math.sin(targetRad) * (lengthPx / 1000);
  const targetDistalY = origin.y + Math.cos(targetRad) * (lengthPx / 1000);

  return {
    origin,
    currentDistal,
    targetDistal: { x: targetDistalX, y: targetDistalY, z: origin.z },
    ghostLineColor: 'rgba(6, 182, 212, 0.45)',
    arcColor: 'rgba(16, 185, 129, 0.65)',
  };
}

export function ArTrajectoryGuide(props: ArTrajectoryProps) {
  return calculateGhostTrajectoryPath(
    props.originJoint,
    props.distalJoint,
    props.targetAngleDegrees,
    props.limbLengthPx
  );
}

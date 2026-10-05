import { Point3D } from '../kinematics/types.js';

export interface JointNode3D {
  id: string;
  name: string;
  parentId: string | null;
  localOffset: Point3D;
  worldPosition: Point3D;
  flexionAngleDeg: number;
}

export function createDefaultSkeletalTree(): Record<string, JointNode3D> {
  return {
    pelvis: { id: 'pelvis', name: 'Pelvis', parentId: null, localOffset: { x: 0, y: 0, z: 0 }, worldPosition: { x: 0, y: 0, z: 0 }, flexionAngleDeg: 0 },
    spine: { id: 'spine', name: 'Spine', parentId: 'pelvis', localOffset: { x: 0, y: 0.3, z: 0 }, worldPosition: { x: 0, y: 0.3, z: 0 }, flexionAngleDeg: 0 },
    neck: { id: 'neck', name: 'Neck', parentId: 'spine', localOffset: { x: 0, y: 0.25, z: 0 }, worldPosition: { x: 0, y: 0.55, z: 0 }, flexionAngleDeg: 0 },
    leftHip: { id: 'leftHip', name: 'Left Hip', parentId: 'pelvis', localOffset: { x: -0.15, y: -0.05, z: 0 }, worldPosition: { x: -0.15, y: -0.05, z: 0 }, flexionAngleDeg: 0 },
    leftKnee: { id: 'leftKnee', name: 'Left Knee', parentId: 'leftHip', localOffset: { x: 0, y: -0.4, z: 0 }, worldPosition: { x: -0.15, y: -0.45, z: 0 }, flexionAngleDeg: 0 },
    leftAnkle: { id: 'leftAnkle', name: 'Left Ankle', parentId: 'leftKnee', localOffset: { x: 0, y: -0.4, z: 0 }, worldPosition: { x: -0.15, y: -0.85, z: 0 }, flexionAngleDeg: 0 },
    rightHip: { id: 'rightHip', name: 'Right Hip', parentId: 'pelvis', localOffset: { x: 0.15, y: -0.05, z: 0 }, worldPosition: { x: 0.15, y: -0.05, z: 0 }, flexionAngleDeg: 0 },
    rightKnee: { id: 'rightKnee', name: 'Right Knee', parentId: 'rightHip', localOffset: { x: 0, y: -0.4, z: 0 }, worldPosition: { x: 0.15, y: -0.45, z: 0 }, flexionAngleDeg: 0 },
    rightAnkle: { id: 'rightAnkle', name: 'Right Ankle', parentId: 'rightKnee', localOffset: { x: 0, y: -0.4, z: 0 }, worldPosition: { x: 0.15, y: -0.85, z: 0 }, flexionAngleDeg: 0 },
  };
}

/**
 * Propagates forward kinematics down the 3D musculoskeletal hierarchy.
 */
export function updateForwardKinematics(
  tree: Record<string, JointNode3D>,
  rootPosition: Point3D,
  jointAngles: Record<string, number>
): Record<string, JointNode3D> {
  const updated: Record<string, JointNode3D> = {};

  for (const key of Object.keys(tree)) {
    const node = { ...tree[key] };
    const angle = jointAngles[key] ?? node.flexionAngleDeg;
    node.flexionAngleDeg = angle;

    if (!node.parentId) {
      node.worldPosition = { ...rootPosition };
    } else {
      const parent = updated[node.parentId];
      const rad = (angle * Math.PI) / 180.0;
      const rotatedY = node.localOffset.y * Math.cos(rad) - node.localOffset.z * Math.sin(rad);
      const rotatedZ = node.localOffset.y * Math.sin(rad) + node.localOffset.z * Math.cos(rad);

      node.worldPosition = {
        x: parent.worldPosition.x + node.localOffset.x,
        y: parent.worldPosition.y + rotatedY,
        z: parent.worldPosition.z + rotatedZ,
      };
    }
    updated[key] = node;
  }

  return updated;
}

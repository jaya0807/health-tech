import { useState, useEffect } from 'react';
import { Landmark3D } from '../../../core/kinematics/types.js';
import { calculate3DAngle } from '../../../core/kinematics/angleCalculator.js';

export function useLiveKinematics(landmarks: Landmark3D[], bodyArea: string, currentExercise: string) {
  const [currentAngle, setCurrentAngle] = useState(-1);

  useEffect(() => {
    if (!landmarks || landmarks.length < 17) return;

    let angle = 0;

    const getBestSide = (leftIdx: [number, number, number], rightIdx: [number, number, number]) => {
      const l1 = landmarks[leftIdx[0]], l2 = landmarks[leftIdx[1]], l3 = landmarks[leftIdx[2]];
      const r1 = landmarks[rightIdx[0]], r2 = landmarks[rightIdx[1]], r3 = landmarks[rightIdx[2]];
      
      const lScore = (l1?.visibility || 0) + (l2?.visibility || 0) + (l3?.visibility || 0);
      const rScore = (r1?.visibility || 0) + (r2?.visibility || 0) + (r3?.visibility || 0);
      
      // Set threshold to 0.05 to allow heavily occluded hips/knees/ankles (common with baggy clothes or poor lighting)
      const threshold = 0.05;
      const isLeftValid = l1 && l2 && l3 && l1.visibility! > threshold && l2.visibility! > threshold && l3.visibility! > threshold;
      const isRightValid = r1 && r2 && r3 && r1.visibility! > threshold && r2.visibility! > threshold && r3.visibility! > threshold;
      
      if (isLeftValid && isRightValid) return lScore > rScore ? [l1, l2, l3] : [r1, r2, r3];
      if (isLeftValid) return [l1, l2, l3];
      if (isRightValid) return [r1, r2, r3];
      return null;
    };

    let targetJoints = 'Leg';
    const ex = currentExercise.toLowerCase();
    if (ex.includes('shoulder') || ex.includes('wall slide') || ex.includes('arm')) {
      targetJoints = 'Arm';
    } else if (ex.includes('trunk') || ex.includes('bend') || ex.includes('back') || ex.includes('hinge')) {
      targetJoints = 'Trunk';
    }

    if (targetJoints === 'Arm') {
      // Left Arm: Hip(11), Shoulder(5), Elbow(7)
      // Right Arm: Hip(12), Shoulder(6), Elbow(8)
      const best = getBestSide([11, 5, 7], [12, 6, 8]);
      if (best) angle = calculate3DAngle(best[0], best[1], best[2]);
    } else if (targetJoints === 'Trunk') {
      // Trunk Bending: Shoulder(5), Hip(11), Knee(13)
      const best = getBestSide([5, 11, 13], [6, 12, 14]);
      if (best) angle = calculate3DAngle(best[0], best[1], best[2]);
    } else {
      // Default to Leg: Hip(11), Knee(13), Ankle(15)
      const best = getBestSide([11, 13, 15], [12, 14, 16]);
      if (best) angle = calculate3DAngle(best[0], best[1], best[2]);
    }

    if (angle > 0) {
      let mappedAngle = 0;
      
      if (currentExercise.includes('Seated Knee Extensions')) {
        // Start: 90 deg (bent), Target: 180 deg (straight)
        // We map this so progress starts at 0 and goes up to 90
        mappedAngle = Math.max(0, angle - 90);
      } else if (currentExercise.includes('Shoulder') || currentExercise.includes('Wall Crawl') || currentExercise.includes('Press')) {
        // Shoulder flexion: Start: arm down (0-20 deg), Target: arm up (180 deg)
        // We map this directly so progress starts at 0 and goes up
        mappedAngle = angle;
      } else {
        // Default Flexion (Squats, Hamstring Curls, Leg Raises)
        // Start: 180 deg (straight), Target: ~90 deg (bent)
        // We map this so progress starts at 0 and goes up as joint bends
        mappedAngle = Math.max(0, 180 - angle);
      }
      
      console.log(`[TF Kinematics] Time: ${Date.now()}ms | Joint: ${bodyArea} | Anatomical Angle: ${Math.round(angle)}° | Output Angle: ${Math.round(mappedAngle)}°`);
      setCurrentAngle(Math.round(mappedAngle));
    }

  }, [landmarks, bodyArea, currentExercise]);

  return { currentAngle };
}

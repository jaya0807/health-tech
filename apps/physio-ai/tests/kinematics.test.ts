import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculate3DAngle, calculateKneeAngle } from '../src/core/kinematics/angleCalculator.js';
import { calculateKinematicDerivatives, calculateNormalizedJerkMetric } from '../src/core/kinematics/velocityJerkEstimator.js';
import { computeCompositeMqs, calculateAccuracyScore } from '../src/core/kinematics/motionQualityScore.js';
import { evaluateBilateralSymmetry } from '../src/core/kinematics/bilateralSymmetry.js';
import { OneEuroPointFilter } from '../src/core/vision/landmarkSmoothing.js';
import { PoseDataValidator } from '../src/core/vision/poseDetector.js';

describe('Biomechanical Kinematics Engine Tests', () => {
  describe('1. 3D Vector Angle Geometry', () => {
    test('Calculates exact 90.0° right angle', () => {
      const a = { x: 0, y: 1, z: 0 };
      const b = { x: 0, y: 0, z: 0 }; // vertex
      const c = { x: 1, y: 0, z: 0 };
      const angle = calculate3DAngle(a, b, c);
      assert.ok(Math.abs(angle - 90.0) < 0.001, `Expected 90°, got ${angle}`);
    });

    test('Calculates exact 180.0° straight alignment', () => {
      const a = { x: 0, y: 1, z: 0 };
      const b = { x: 0, y: 0, z: 0 };
      const c = { x: 0, y: -1, z: 0 };
      const angle = calculate3DAngle(a, b, c);
      assert.ok(Math.abs(angle - 180.0) < 0.001, `Expected 180°, got ${angle}`);
    });

    test('Calculates exact 45.0° acute angle', () => {
      const a = { x: 1, y: 1, z: 0 };
      const b = { x: 0, y: 0, z: 0 };
      const c = { x: 1, y: 0, z: 0 };
      const angle = calculate3DAngle(a, b, c);
      assert.ok(Math.abs(angle - 45.0) < 0.001, `Expected 45°, got ${angle}`);
    });

    test('Calculates 3D spatial angle with non-zero Z coordinate', () => {
      const a = { x: 1, y: 0, z: 1 };
      const b = { x: 0, y: 0, z: 0 };
      const c = { x: 0, y: 1, z: 0 };
      const angle = calculate3DAngle(a, b, c);
      assert.ok(Math.abs(angle - 90.0) < 0.001, `Expected 90°, got ${angle}`);
    });

    test('Knee & Elbow landmark helper functions compute properly', () => {
      const hip = { x: 0, y: 1, z: 0, visibility: 0.95 };
      const knee = { x: 0, y: 0, z: 0, visibility: 0.95 };
      const ankle = { x: 1, y: 0, z: 0, visibility: 0.95 };
      const kneeAngle = calculateKneeAngle(hip, knee, ankle);
      assert.ok(Math.abs(kneeAngle - 90.0) < 0.001);
    });
  });

  describe('2. Velocity & Jerk Estimation', () => {
    test('Calculates angular velocity from angle delta over time', () => {
      const prev = { angleDegrees: 0, timestampMs: 1000 };
      const curr = { angleDegrees: 90, timestampMs: 2000 };
      const deriv = calculateKinematicDerivatives(curr, prev);
      assert.equal(deriv.velocityDegPerSec, 90);
    });

    test('Computes normalized jerk across frames', () => {
      const frames = [
        { timestampMs: 0, angleDegrees: 0, velocityDegPerSec: 0, jerk: 10 },
        { timestampMs: 100, angleDegrees: 10, velocityDegPerSec: 100, jerk: 20 },
      ];
      const jerkCost = calculateNormalizedJerkMetric(frames);
      assert.ok(jerkCost > 0);
    });
  });

  describe('3. 4D Motion Quality Score (MQS)', () => {
    test('Returns 100% MQS on flawless target rep', () => {
      const mqs = computeCompositeMqs({
        actualPeakAngle: 90,
        targetAngle: 90,
        centerOfMassDriftMm: 0,
        normalizedJerk: 0,
        leftRightAngleVarianceDeg: 0,
      });
      assert.equal(mqs.accuracyScore, 100);
      assert.equal(mqs.balanceScore, 100);
      assert.equal(mqs.smoothnessScore, 100);
      assert.equal(mqs.compositeMqs, 100);
    });

    test('Correctly penalizes under-flexion ROM', () => {
      const accuracy = calculateAccuracyScore(45, 90);
      assert.equal(accuracy, 50); // 50% error
    });
  });

  describe('4. Bilateral Symmetry Evaluation', () => {
    test('Detects balanced bilateral movement', () => {
      const result = evaluateBilateralSymmetry(90, 90);
      assert.equal(result.asymmetryPercentage, 0);
      assert.equal(result.isClinicallySignificant, false);
      assert.equal(result.compensatingSide, 'BALANCED');
    });

    test('Detects clinically significant asymmetrical compensation', () => {
      const result = evaluateBilateralSymmetry(90, 45);
      assert.equal(result.asymmetryPercentage, 50);
      assert.equal(result.isClinicallySignificant, true);
      assert.equal(result.compensatingSide, 'LEFT');
    });
  });

  describe('5. 1-Euro Landmark Smoothing & Pose Validation', () => {
    test('1-Euro filter attenuates high-frequency noise', () => {
      const filter = new OneEuroPointFilter();
      const initial = filter.filter(100.0);
      assert.equal(initial, 100.0);

      // Add small noise
      const smoothed = filter.filter(101.0);
      assert.ok(smoothed < 101.0 && smoothed >= 100.0);
    });

    test('PoseDataValidator gates low confidence landmarks', () => {
      const validator = new PoseDataValidator(0.7);
      const rawLandmarks = [
        { x: 0.5, y: 0.5, z: 0, visibility: 0.9 },
        { x: 0.5, y: 0.8, z: 0, visibility: 0.4 }, // below 0.7 threshold
      ];

      const validLm = validator.extractLandmark(rawLandmarks, 0);
      const invalidLm = validator.extractLandmark(rawLandmarks, 1);

      assert.notEqual(validLm, null);
      assert.equal(invalidLm, null);
    });
  });
});

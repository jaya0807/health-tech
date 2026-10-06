import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultSkeletalTree, updateForwardKinematics } from '../src/core/digitalTwin/skeletalHierarchy.js';
import { calculateJointStress } from '../src/core/digitalTwin/jointStressHeatmap.js';
import { projectRecoveryTrajectory } from '../src/core/predictive/recoveryPredictor.js';
import { aggregateLongitudinalTrends } from '../src/core/predictive/trendAggregator.js';

describe('3D Digital Twin & Predictive Recovery Engine Tests', () => {
  describe('1. 3D Musculoskeletal Skeletal Hierarchy', () => {
    test('Initializes default skeletal tree structure', () => {
      const tree = createDefaultSkeletalTree();
      assert.ok(tree.pelvis);
      assert.ok(tree.leftKnee);
      assert.ok(tree.rightKnee);
      assert.equal(tree.leftKnee.parentId, 'leftHip');
    });

    test('Propagates forward kinematics down the hierarchy', () => {
      const tree = createDefaultSkeletalTree();
      const updated = updateForwardKinematics(tree, { x: 0, y: 1.0, z: 0 }, { leftKnee: 45 });
      assert.equal(updated.pelvis.worldPosition.y, 1.0);
      assert.ok(updated.leftAnkle.worldPosition.z !== 0); // Rotated in Z plane
    });
  });

  describe('2. Joint Stress & Heatmap Shaders', () => {
    test('Calculates low/normal joint stress for gentle flexion', () => {
      const stress = calculateJointStress({
        jointAngleDeg: 30,
        angularAccelerationDegPerSec2: 10,
        segmentMassKg: 4.0,
        segmentLengthM: 0.45,
      });
      assert.equal(stress.stressTier, 'LOW');
      assert.equal(stress.heatmapColor, '#27272a');
    });

    test('Identifies high mechanical stress and assigns acute ruby color', () => {
      const stress = calculateJointStress({
        jointAngleDeg: 90,
        angularAccelerationDegPerSec2: 1500, // High acceleration impulse
        segmentMassKg: 6.0,
        segmentLengthM: 0.5,
        maxAllowableTorqueNm: 20.0,
      });
      assert.equal(stress.stressTier, 'HIGH');
      assert.equal(stress.heatmapColor, '#ef4444');
    });
  });

  describe('3. Predictive Tissue Remodeling Recovery Curve', () => {
    test('Generates 16-week exponential recovery forecast', () => {
      const forecast = projectRecoveryTrajectory({
        startingRomDeg: 45,
        targetMilestoneRomDeg: 90,
        fullRecoveryRomDeg: 120,
        complianceFraction: 0.9,
      });
      assert.equal(forecast.forecastTrajectory.length, 17);
      assert.equal(forecast.milestoneAchievable, true);
      assert.ok(forecast.estimatedWeeksToMilestone > 0 && forecast.estimatedWeeksToMilestone <= 10);
    });

    test('Low compliance prolongs estimated weeks to milestone', () => {
      const highCompliance = projectRecoveryTrajectory({
        startingRomDeg: 45,
        targetMilestoneRomDeg: 90,
        fullRecoveryRomDeg: 120,
        complianceFraction: 0.95,
      });
      const lowCompliance = projectRecoveryTrajectory({
        startingRomDeg: 45,
        targetMilestoneRomDeg: 90,
        fullRecoveryRomDeg: 120,
        complianceFraction: 0.25,
      });
      assert.ok(lowCompliance.estimatedWeeksToMilestone > highCompliance.estimatedWeeksToMilestone);
    });
  });

  describe('4. Longitudinal Trend Aggregator', () => {
    test('Computes 7-day moving averages and recovery velocity', () => {
      const logs = [
        { date: '2026-08-01', maxRomDeg: 50, compositeMqs: 75, painVas: 6, bilateralSymmetryPercent: 78 },
        { date: '2026-08-08', maxRomDeg: 65, compositeMqs: 82, painVas: 4, bilateralSymmetryPercent: 85 },
        { date: '2026-08-15', maxRomDeg: 80, compositeMqs: 90, painVas: 2, bilateralSymmetryPercent: 92 },
      ];

      const trends = aggregateLongitudinalTrends(logs);
      assert.equal(trends.totalRomGainDeg, 30); // 80 - 50
      assert.equal(trends.totalPainReduction, 4); // 6 - 2
      assert.ok(trends.weeklyRomVelocityDeg > 0);
    });
  });
});

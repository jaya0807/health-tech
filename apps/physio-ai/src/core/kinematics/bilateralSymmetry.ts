export interface BilateralEvaluation {
  asymmetryPercentage: number;
  isClinicallySignificant: boolean;
  compensatingSide: 'LEFT' | 'RIGHT' | 'BALANCED';
}

/**
 * Evaluates contralateral symmetry between left and right limbs.
 * A difference > 15% is typically considered clinically significant compensation.
 */
export function evaluateBilateralSymmetry(
  leftAngle: number,
  rightAngle: number,
  significanceThreshold = 15.0
): BilateralEvaluation {
  const maxAngle = Math.max(Math.abs(leftAngle), Math.abs(rightAngle));

  if (maxAngle === 0) {
    return {
      asymmetryPercentage: 0,
      isClinicallySignificant: false,
      compensatingSide: 'BALANCED',
    };
  }

  const delta = Math.abs(leftAngle - rightAngle);
  const asymmetryPercentage = (delta / maxAngle) * 100;
  const isClinicallySignificant = asymmetryPercentage >= significanceThreshold;

  let compensatingSide: 'LEFT' | 'RIGHT' | 'BALANCED' = 'BALANCED';
  if (isClinicallySignificant) {
    compensatingSide = leftAngle > rightAngle ? 'LEFT' : 'RIGHT';
  }

  return {
    asymmetryPercentage: Number(asymmetryPercentage.toFixed(1)),
    isClinicallySignificant,
    compensatingSide,
  };
}

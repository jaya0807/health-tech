import { Landmark3D } from '../kinematics/types.js';

export interface OneEuroConfig {
  minCutoff: number; // Minimum cutoff frequency (Hz)
  beta: number;      // Speed coefficient
  dCutoff: number;   // Derivative cutoff frequency (Hz)
}

const DEFAULT_CONFIG: OneEuroConfig = {
  minCutoff: 1.0,
  beta: 0.007,
  dCutoff: 1.0,
};

function alpha(rate: number, cutoff: number): number {
  const tau = 1.0 / (2 * Math.PI * cutoff);
  const te = 1.0 / rate;
  return 1.0 / (1.0 + tau / te);
}

export class OneEuroPointFilter {
  private xPrev = 0;
  private dxPrev = 0;
  private isInitialized = false;

  constructor(private config: OneEuroConfig = DEFAULT_CONFIG) {}

  public filter(value: number, rate = 30.0): number {
    if (!this.isInitialized) {
      this.xPrev = value;
      this.dxPrev = 0;
      this.isInitialized = true;
      return value;
    }

    const dAlpha = alpha(rate, this.config.dCutoff);
    const dx = (value - this.xPrev) * rate;
    const dxHat = dAlpha * dx + (1.0 - dAlpha) * this.dxPrev;

    const cutoff = this.config.minCutoff + this.config.beta * Math.abs(dxHat);
    const a = alpha(rate, cutoff);
    const xHat = a * value + (1.0 - a) * this.xPrev;

    this.xPrev = xHat;
    this.dxPrev = dxHat;

    return xHat;
  }
}

export class Landmark3DSmoother {
  private xFilter = new OneEuroPointFilter();
  private yFilter = new OneEuroPointFilter();
  private zFilter = new OneEuroPointFilter();

  public smooth(raw: Landmark3D, frameRate = 30.0): Landmark3D {
    return {
      x: this.xFilter.filter(raw.x, frameRate),
      y: this.yFilter.filter(raw.y, frameRate),
      z: this.zFilter.filter(raw.z, frameRate),
      visibility: raw.visibility,
    };
  }
}

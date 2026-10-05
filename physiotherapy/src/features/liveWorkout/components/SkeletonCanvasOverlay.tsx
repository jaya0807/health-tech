import React, { useRef, useEffect } from 'react';
import { Landmark3D } from '../../../core/kinematics/types.js';

export interface SkeletonRenderOptions {
  boneColor?: string;
  jointColor?: string;
  jointRadius?: number;
  boneWidth?: number;
  isMirrored?: boolean;
}

export const SKELETON_CONNECTIONS: [number, number][] = [
  // Torso & Shoulders
  [5, 6], [5, 11], [6, 12], [11, 12],
  // Arms
  [5, 7], [7, 9], [6, 8], [8, 10],
  // Legs
  [11, 13], [13, 15], [12, 14], [14, 16]
];

export function renderSkeletonOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: (Landmark3D | null)[],
  width: number,
  height: number,
  options: SkeletonRenderOptions = {}
): void {
  ctx.clearRect(0, 0, width, height);

  const isMirrored = options.isMirrored ?? true;
  
  // Simple 3D to 2D perspective projection
  const project3D = (rawX: number, y: number, z: number = 0) => {
    // Flip X to match the CSS scaleX(-1) mirror on the video element
    const x = isMirrored ? (width - rawX) : rawX;
    const zOffset = 150; 
    const focalLength = 150;
    const scale = (focalLength / (focalLength + zOffset - z)) * 2.2;
    const cx = width / 2; 
    const cy = height / 2;
    const px = (x - cx) * scale + cx;
    const py = (y - cy) * scale + cy;
    return { px, py, scale };
  };

  ctx.strokeStyle = options.boneColor ?? 'rgba(255, 255, 255, 0.85)';
  ctx.lineCap = 'round';

  for (const [startIdx, endIdx] of SKELETON_CONNECTIONS) {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    if (start && end && (start.visibility ?? 1) > 0.15 && (end.visibility ?? 1) > 0.15) {
      const p1 = project3D(start.x, start.y, start.z);
      const p2 = project3D(end.x, end.y, end.z);
      
      ctx.lineWidth = (options.boneWidth ?? 4) * ((p1.scale + p2.scale) / 2);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
    }
  }

  ctx.fillStyle = options.jointColor ?? '#10b981';
  for (const lm of landmarks) {
    if (lm && (lm.visibility ?? 1) > 0.15) {
      const p = project3D(lm.x, lm.y, lm.z);
      ctx.beginPath();
      ctx.arc(p.px, p.py, (options.jointRadius ?? 6) * p.scale * 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

interface SkeletonCanvasOverlayProps {
  landmarks: Landmark3D[];
  width?: number;
  height?: number;
  isMirrored?: boolean;
}

export const SkeletonCanvasOverlay: React.FC<SkeletonCanvasOverlayProps> = ({ landmarks, width = 640, height = 480, isMirrored = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderSkeletonOnCanvas(ctx, landmarks, width, height, { isMirrored });
  }, [landmarks, width, height, isMirrored]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />;
};

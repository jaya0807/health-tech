import React, { RefObject } from 'react';

export interface CameraViewportProps {
  width?: number | string;
  height?: number | string;
  isMirrored?: boolean;
  isStreaming?: boolean;
  children?: React.ReactNode;
  videoRef?: RefObject<HTMLVideoElement>;
  showVideo?: boolean;
  zoom?: number;
}

export function getViewportStyles(isMirrored = true) {
  return {
    container: {
      position: 'relative' as const,
      width: '640px',
      height: '480px',
      backgroundColor: '#000000',
      borderRadius: '16px',
      overflow: 'hidden' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #27272a',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      transform: isMirrored ? 'scaleX(-1)' : 'none',
    },
  };
}

export const CameraViewport: React.FC<CameraViewportProps> = ({ isMirrored = true, children, videoRef, showVideo = false, zoom = 1 }) => {
  const styles = getViewportStyles(isMirrored);
  return (
    <div style={styles.container}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transition: 'transform 0.3s ease', transformOrigin: 'center center' }}>
        {videoRef && (
          <video 
            ref={videoRef} 
            style={{ ...styles.video, position: 'absolute', top: 0, left: 0, opacity: showVideo ? 1 : 0 }} 
            autoPlay
            playsInline 
            muted 
          />
        )}
        {children}
      </div>
    </div>
  );
};

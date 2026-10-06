import React from 'react';

export interface CoachBannerProps {
  currentMessage?: string;
  subtitle?: string;
  isSpeaking?: boolean;
  onMuteToggle?: () => void;
  isMuted?: boolean;
}

export function formatCoachFeedback(message = '', isSpeaking = false) {
  const msg = typeof message === 'string' ? message : '';
  return {
    displayMessage: msg.trim() || 'Monitoring posture & range of motion...',
    isSpeaking,
    statusDotColor: isSpeaking ? 'var(--bio-emerald, #10b981)' : 'var(--text-muted, #64748b)',
  };
}

export const CoachFeedbackBanner: React.FC<CoachBannerProps> = ({ currentMessage, subtitle, isSpeaking = false }) => {
  const message = currentMessage || subtitle || '';
  const { displayMessage, statusDotColor } = formatCoachFeedback(message, isSpeaking);

  return (
    <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '640px' }}>
      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusDotColor, boxShadow: isSpeaking ? '0 0 10px #10b981' : 'none' }} />
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{displayMessage}</span>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';

export function useVoiceCoach(currentAngle: number, targetAngle: number, isActive: boolean) {
  const [coachMessage, setCoachMessage] = useState("Ready to start.");
  const [phase, setPhase] = useState<'BENDING' | 'HOLDING' | 'RETURNING'>('RETURNING');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lastSpokenPhase = useRef<string>('');
  const lastSpokenTime = useRef<number>(0);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isActive) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      lastSpokenPhase.current = '';
      return;
    }

    if (currentAngle < 0) {
      if (coachMessage !== "Detecting your posture...") {
        setCoachMessage("Detecting your posture...");
      }
      return;
    }

    const now = Date.now();

    let newPhase = phase;
    let newMessage = coachMessage;
    let shouldSpeak = false;

    if (currentAngle < 15) {
      newPhase = 'RETURNING';
      newMessage = "You are in the starting position. When you're ready, start the movement.";
      if (lastSpokenPhase.current !== 'START' && now - lastSpokenTime.current > 5000) {
        shouldSpeak = true;
        lastSpokenPhase.current = 'START';
      }
    } else if (currentAngle < targetAngle - 10) {
      newPhase = 'BENDING';
      newMessage = `You are at ${currentAngle} degrees. Keep going until you reach ${targetAngle}.`;
      // Speak progress at every 30-degree marker
      const progressMarker = Math.floor(currentAngle / 30) * 30;
      const markerKey = `BENDING_${progressMarker}`;
      if (lastSpokenPhase.current !== markerKey && currentAngle > 20) {
        shouldSpeak = true;
        lastSpokenPhase.current = markerKey;
      }
    } else if (currentAngle >= targetAngle - 10 && currentAngle <= targetAngle + 15) {
      newPhase = 'HOLDING';
      newMessage = `Perfect! You reached ${currentAngle} degrees. Hold this position.`;
      if (lastSpokenPhase.current !== 'HOLDING') {
        shouldSpeak = true;
        lastSpokenPhase.current = 'HOLDING';
      }
    } else if (currentAngle > targetAngle + 15) {
      newPhase = 'RETURNING';
      newMessage = `You went too far to ${currentAngle} degrees. Slowly lower back down.`;
      if (lastSpokenPhase.current !== 'TOO_FAR') {
        shouldSpeak = true;
        lastSpokenPhase.current = 'TOO_FAR';
      }
    }

    if (newPhase !== phase) setPhase(newPhase);
    if (newMessage !== coachMessage) setCoachMessage(newMessage);
    if (shouldSpeak) {
      speak(newMessage);
      lastSpokenTime.current = now;
    }
  }, [currentAngle, targetAngle, isActive]);

  return { coachMessage, phase, isSpeaking };
}

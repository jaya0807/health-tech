export type VoiceCommandType = 'START' | 'PAUSE' | 'RESUME' | 'NEXT_EXERCISE' | 'PAIN' | 'HELP' | 'UNKNOWN';

export interface PainTriageResult {
  reportedPain: boolean;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'NONE';
  suggestedAction: 'CONTINUE' | 'REDUCE_INTENSITY' | 'PAUSE_AND_NOTIFY_CLINICIAN';
  locationDetected?: string;
}

export function parseVoiceCommand(transcript: string): VoiceCommandType {
  const text = transcript.trim().toLowerCase();

  if (text.includes('start') || text.includes('begin') || text.includes('ready')) return 'START';
  if (text.includes('pause') || text.includes('wait') || text.includes('stop')) return 'PAUSE';
  if (text.includes('resume') || text.includes('continue')) return 'RESUME';
  if (text.includes('next') || text.includes('skip')) return 'NEXT_EXERCISE';
  if (text.includes('pain') || text.includes('hurts') || text.includes('ouch')) return 'PAIN';
  if (text.includes('help') || text.includes('emergency') || text.includes('fallen')) return 'HELP';

  return 'UNKNOWN';
}

export function triageConversationalPain(transcript: string): PainTriageResult {
  const text = transcript.toLowerCase();

  if (text.includes('sharp') || text.includes('severe') || text.includes('unbearable') || text.includes('popped')) {
    return {
      reportedPain: true,
      severity: 'SEVERE',
      suggestedAction: 'PAUSE_AND_NOTIFY_CLINICIAN',
      locationDetected: extractLocation(text),
    };
  }

  if (text.includes('hurts') || text.includes('moderate') || text.includes('burning') || text.includes('sore')) {
    return {
      reportedPain: true,
      severity: 'MODERATE',
      suggestedAction: 'REDUCE_INTENSITY',
      locationDetected: extractLocation(text),
    };
  }

  if (text.includes('stiff') || text.includes('mild') || text.includes('little')) {
    return {
      reportedPain: true,
      severity: 'MILD',
      suggestedAction: 'CONTINUE',
      locationDetected: extractLocation(text),
    };
  }

  return {
    reportedPain: false,
    severity: 'NONE',
    suggestedAction: 'CONTINUE',
  };
}

function extractLocation(text: string): string | undefined {
  if (text.includes('knee')) return 'KNEE';
  if (text.includes('shoulder')) return 'SHOULDER';
  if (text.includes('back') || text.includes('spine')) return 'SPINE';
  if (text.includes('hip')) return 'HIP';
  if (text.includes('ankle')) return 'ANKLE';
  return undefined;
}

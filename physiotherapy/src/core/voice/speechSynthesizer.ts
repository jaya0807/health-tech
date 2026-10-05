export type SpeechPriority = 'HIGH' | 'NORMAL' | 'LOW';

export interface SpeechRequest {
  id: string;
  text: string;
  priority: SpeechPriority;
  cooldownMs?: number;
  timestampMs?: number;
}

export class SpeechSynthesizerEngine {
  private lastSpokenTime = 0;
  private lastSpokenText = '';
  private isSpeaking = false;
  private queue: SpeechRequest[] = [];
  private onSpeakCallback?: (text: string) => void;

  constructor(onSpeak?: (text: string) => void) {
    this.onSpeakCallback = onSpeak;
  }

  public speak(request: SpeechRequest): boolean {
    const now = request.timestampMs ?? Date.now();
    const cooldown = request.cooldownMs ?? 2000;

    // Reject identical text if within cooldown window unless priority is HIGH
    if (request.priority !== 'HIGH' && request.text === this.lastSpokenText && now - this.lastSpokenTime < cooldown) {
      return false;
    }

    if (request.priority === 'HIGH') {
      this.queue.unshift(request);
      this.processNext(true);
      return true;
    }

    this.queue.push(request);
    this.processNext(false);
    return true;
  }

  private processNext(forceInterrupt = false): void {
    if (this.queue.length === 0) return;
    if (this.isSpeaking && !forceInterrupt) return;

    const current = this.queue.shift();
    if (!current) return;

    this.isSpeaking = true;
    this.lastSpokenText = current.text;
    this.lastSpokenTime = current.timestampMs ?? Date.now();

    if (this.onSpeakCallback) {
      this.onSpeakCallback(current.text);
    }

    // In a browser runtime, this calls window.speechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(current.text);
      utterance.rate = 1.05;
      utterance.onend = () => {
        this.isSpeaking = false;
        this.processNext();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Headless / mock environment completes immediately
      this.isSpeaking = false;
    }
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public clearQueue(): void {
    this.queue = [];
    this.isSpeaking = false;
  }
}

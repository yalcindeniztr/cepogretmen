export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognition: any = null;

  /**
   * Speaks the given Turkish text aloud.
   */
  static speak(text: string, onEnd?: () => void): void {
    if (!this.synth) return;
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a Turkish voice if available
    const voices = this.synth.getVoices();
    const trVoice = voices.find(v => v.lang.startsWith('tr'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  static stopSpeaking(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Initializes and starts Turkish speech recognition
   */
  static startListening(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): () => void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      onEnd();
      return () => {};
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'tr-TR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Ses algılanamadı.');
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch (e) {
            // ignore
          }
        }
      };
    } catch (e: any) {
      onError(e.message || 'Mikrofon başlatılamadı.');
      onEnd();
      return () => {};
    }
  }
}

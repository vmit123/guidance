class AdvancedVoiceProcessor {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.voiceSettings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      voice: null
    };
    this.learningData = {
      successfulRecognitions: 0,
      failedRecognitions: 0,
      userPreferences: {},
      commonPhrases: new Map()
    };
    
    // Only init in browser
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    if (typeof window === 'undefined') return;
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      // Load voices (may need to wait)
      if (this.synthesis.getVoices().length === 0) {
        this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
      } else {
        this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (this.synthesis) {
      const voices = this.synthesis.getVoices();
      const preferred = voices.find(v =>
        v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen')
      );
      this.voiceSettings.voice = preferred || voices[0];
    }
  }

  handleRecognitionResult(event) {
    const results = event.results;
    const last = results[results.length - 1];
    if (last.isFinal) {
      const transcript = last[0].transcript;
      const confidence = last[0].confidence;
      this.learningData.successfulRecognitions++;
      return { transcript, confidence };
    }
    return null;
  }

  handleRecognitionError(event) {
    this.learningData.failedRecognitions++;
    console.error('Recognition error:', event.error);
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch (error) {
        console.error('Failed to start recognition:', error);
        return false;
      }
    }
    return false;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text, emotion = 'neutral') {
    if (!this.synthesis) return Promise.resolve();

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.voiceSettings.rate;
    utterance.pitch = this.voiceSettings.pitch;
    utterance.volume = this.voiceSettings.volume;
    if (this.voiceSettings.voice) {
      utterance.voice = this.voiceSettings.voice;
    }

    switch (emotion) {
      case 'positive':
        utterance.rate = Math.min(1.2, utterance.rate + 0.2);
        utterance.pitch = Math.min(1.3, utterance.pitch + 0.3);
        break;
      case 'negative':
        utterance.rate = Math.max(0.6, utterance.rate - 0.2);
        utterance.pitch = Math.max(0.7, utterance.pitch - 0.2);
        break;
    }

    return new Promise((resolve, reject) => {
      utterance.onend = resolve;
      utterance.onerror = reject;
      this.synthesis.speak(utterance);
    });
  }

  getLearningStats() {
    const total = this.learningData.successfulRecognitions + this.learningData.failedRecognitions;
    return {
      successRate: total > 0 ? this.learningData.successfulRecognitions / total : 0,
      totalInteractions: total
    };
  }

  isSupported() {
    return !!(this.recognition || this.synthesis);
  }
}

export default AdvancedVoiceProcessor;

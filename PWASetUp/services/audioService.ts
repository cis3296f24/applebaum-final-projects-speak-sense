interface AudioServiceConfig {
  onDataAvailable?: (blobs: Blob[]) => void;
}

class AudioService {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private analyserNode: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isInitialized: boolean = false;

  // Helper function to get supported MIME type
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return ''; // Empty string if no supported types found
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check for browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support audio recording');
      }

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Get microphone stream
      this.audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Create and configure nodes
      this.source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyserNode = this.audioContext.createAnalyser();
      
      // Configure analyser
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.8;
      
      // Connect nodes
      this.source.connect(this.analyserNode);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      this.cleanup();
      return false;
    }
  }

  startRecording(config: AudioServiceConfig = {}): boolean {
    if (!this.audioStream || !this.isInitialized) return false;

    try {
      const mimeType = this.getSupportedMimeType();
      if (!mimeType) {
        throw new Error('No supported mime type found for audio recording');
      }

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: mimeType
      });

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        if (config.onDataAvailable) {
          config.onDataAvailable(this.audioChunks);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  stopRecording(): boolean {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
        return true;
      } catch (error) {
        console.error('Error stopping recording:', error);
        return false;
      }
    }
    return false;
  }

  getAudioData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array();
    
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  async playAudio(audioChunks: Blob[]): Promise<void> {
    if (!audioChunks.length) return;

    try {
      const mimeType = this.getSupportedMimeType();
      const blob = new Blob(audioChunks, { type: mimeType || 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      await audio.play();
      
      // Clean up when audio finishes playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  getVolume(): number {
    if (!this.analyserNode) return 0;
    
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(dataArray);
    
    // Calculate RMS (Root Mean Square) volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const amplitude = (dataArray[i] - 128) / 128;
      sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    
    return rms;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  cleanup(): void {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.mediaRecorder = null;
    this.audioStream = null;
    this.analyserNode = null;
    this.source = null;
    this.isInitialized = false;
    this.audioChunks = [];
  }
}

const audioService = new AudioService();
export default audioService;
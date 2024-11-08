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
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(this.audioStream, {
          mimeType: 'audio/webm;codecs=opus'
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
  
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
  
      try {
        await audio.play();
        // Clean up when audio finishes playing
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      } catch (error) {
        console.error('Error playing audio:', error);
        URL.revokeObjectURL(audioUrl);
      }
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
    }
  
    isRecording(): boolean {
      return this.mediaRecorder?.state === 'recording';
    }
  }
  
  const audioService = new AudioService();
  export default audioService;
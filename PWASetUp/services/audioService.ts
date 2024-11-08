export class AudioService {
    private audioContext: AudioContext | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioStream: MediaStream | null = null;
    private audioChunks: Blob[] = [];
    private analyserNode: AnalyserNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
  
    async initialize() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.source = this.audioContext.createMediaStreamSource(this.audioStream);
        this.analyserNode = this.audioContext.createAnalyser();
        
        // Configure analyser
        this.analyserNode.fftSize = 2048;
        this.analyserNode.smoothingTimeConstant = 0.8;
        
        this.source.connect(this.analyserNode);
        return true;
      } catch (error) {
        console.error('Error initializing audio:', error);
        return false;
      }
    }
  
    startRecording(onDataAvailable: (data: Blob[]) => void) {
      if (!this.audioStream) return false;
  
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
  
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.onstop = () => {
        onDataAvailable(this.audioChunks);
      };
  
      this.mediaRecorder.start(100); // Collect data every 100ms
      return true;
    }
  
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        return true;
      }
      return false;
    }
  
    getAudioData(): Uint8Array {
      if (!this.analyserNode) return new Uint8Array();
      
      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(dataArray);
      return dataArray;
    }
  
    async playAudio(audioBlob: Blob): Promise<void> {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    }
  
    cleanup() {
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
      }
      if (this.audioContext) {
        this.audioContext.close();
      }
      this.mediaRecorder = null;
      this.audioStream = null;
      this.analyserNode = null;
      this.source = null;
    }
  }
  
  export const audioService = new AudioService();
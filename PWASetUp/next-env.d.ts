/// <reference types="next" />
/// <reference types="next/image-types/global" />

interface Window {
    webkitAudioContext: typeof AudioContext;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
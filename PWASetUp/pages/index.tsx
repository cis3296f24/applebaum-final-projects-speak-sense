import Page from '../components/page';
import Section from '../components/section';
import ModifyBannedText from 'components/modify-banned';
import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export let fullTranscriptGlobal: string = "";

const Index = () => {
  const [wordbank, setWordbank] = useState<string[]>([]);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false); // Tracks if the stopwatch is running
  const [timeElapsed, setTimeElapsed] = useState(0); // Stopwatch time in seconds
  const [isPaused, setIsPaused] = useState(false); // Tracks if the stopwatch is paused
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isBadWordDetected, setIsBadWordDetected] = useState(false);
  const [bannedWords, setBannedWords] = useState<string[]>([]);
  const [savedTranscript, setSavedTranscript] = useState<string>(""); // Saves the transcript on stop

  useEffect(() => {
    loadWordLists();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadWordLists = async () => {
    try {
      const response = await fetch('wordbank.json');
      if (!response.ok) throw new Error(`Failed to fetch wordbank.json: ${response.statusText}`);
      const data = await response.json();
      setWordbank(data.curseWords || []);
      setFillerWords(data.fillerWords || []);
    } catch (error) {
      console.error('Error loading word lists:', error);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    startStopwatch();
    startSpeechRecognition();
  };

  const handlePause = () => {
    setIsPaused(true);
    stopStopwatch();
    stopSpeechRecognition(false); // Stops but doesn't reset
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeElapsed(0);
    stopStopwatch();
    stopSpeechRecognition(true); // Stops and resets
    setSavedTranscript(fullTranscriptGlobal); // Save the transcript
    fullTranscriptGlobal = ""; // Clear global transcript
  };

  const startStopwatch = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const startSpeechRecognition = () => {
    if (!recognition) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Your browser does not support SpeechRecognition.');
        return;
      }

      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        const fullTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ');

        fullTranscriptGlobal = fullTranscript;
        const output = document.getElementById('fullTranscript');
        if (output) {
          output.textContent = fullTranscript;
        }

        const allBannedWords = [...wordbank, ...bannedWords];

        if (allBannedWords.some((word) => fullTranscript.includes(word))) {
          handleBadWordDetected();
        }
      });

      recognition.start();
    } else {
      recognition.start(); // Restart if paused
    }
  };

  const stopSpeechRecognition = (reset: boolean) => {
    if (recognition) {
      recognition.stop();
      if (reset) {
        recognition = null; // Reset recognition instance
      }
    }
  };

  const handleBadWordDetected = () => {
    setIsBadWordDetected(true);
    setTimeout(() => setIsBadWordDetected(false), 1000);
  };

  return (
    <Page>
      <div className="justify-center w-auto h-auto">
        <h2 className="text-center font-semibold text-2xl">Welcome to SpeakSense.</h2>
      </div>
      <Section>
        <div className="flex items-center justify-center space-x-4 m-12">
          <MicrophoneIcon className="w-32 h-32 text-zinc-200" />
        </div>
        <div className="text-center text-4xl mb-10">{formatTime(timeElapsed)}</div>
        <div className="flex justify-center items-center space-x-6 mb-10">
          {!isRunning || isPaused ? (
            <button
              className="w-16 h-16 rounded-full shadow-lg bg-emerald-500 text-white flex items-center justify-center"
              onClick={handleStart}
            >
              <PlayIcon className="h-8 w-8" />
            </button>
          ) : (
            <button
              className="w-16 h-16 rounded-full shadow-lg bg-teal-600 text-white flex items-center justify-center"
              onClick={handlePause}
            >
              <PauseIcon className="h-8 w-8" />
            </button>
          )}
          <button
            className="w-16 h-16 rounded-full shadow-lg bg-red-600 text-white flex items-center justify-center"
            onClick={handleStop}
          >
            <StopIcon className="h-8 w-8" />
          </button>
        </div>
        {isBadWordDetected && (
          <div className="mt-4 text-center text-red-500 font-semibold">
            Bad word detected!
          </div>
        )}
        <div className="mt-6">
          <ModifyBannedText bannedWords={bannedWords} setBannedWords={setBannedWords} />
        </div>
        
      </Section>
    </Page>
  );
};

let recognition: any = null;

export default Index;

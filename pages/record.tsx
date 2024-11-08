import React, { useState, useEffect, useCallback } from 'react';
import Page from '../PWASetUp/components/page';
import Section from '../PWASetUp/components/section';
import AudioVisualizer from '../PWASetUp/components/AudioVisualizer';
import audioService from '../PWASetUp/services/audioService';
import { MicrophoneIcon, StopIcon, PlayIcon } from '@heroicons/react/24/solid';

const RecordPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array());
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const initAudio = async () => {
      const success = await audioService.initialize();
      if (!success) {
        console.error('Failed to initialize audio');
      }
    };

    initAudio();
    return () => {
      audioService.cleanup();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setAudioData(audioService.getAudioData());
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    setRecordingTime(0);
    const success = audioService.startRecording({
      onDataAvailable: (blobs) => {
        setRecordedBlobs(blobs);
      }
    });

    if (success) {
      setIsRecording(true);
    } else {
      console.error('Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(() => {
    const success = audioService.stopRecording();
    if (success) {
      setIsRecording(false);
    }
  }, []);

  const playRecording = useCallback(async () => {
    if (recordedBlobs.length === 0 || isPlaying) return;

    setIsPlaying(true);
    try {
      await audioService.playAudio(recordedBlobs);
    } finally {
      setIsPlaying(false);
    }
  }, [recordedBlobs, isPlaying]);

  const downloadRecording = useCallback(() => {
    if (recordedBlobs.length === 0) return;

    const blob = new Blob(recordedBlobs, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [recordedBlobs]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 10 / 60);
    const secs = Math.floor((seconds / 10) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Page>
      <Section title="Voice Recording">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {isRecording && (
                <p className="text-primary animate-pulse">
                  Recording: {formatTime(recordingTime)}
                </p>
              )}
            </div>
            <div className="space-x-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`btn ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-primary hover:bg-primary/90'
                } text-white inline-flex items-center space-x-2`}
              >
                {isRecording ? (
                  <>
                    <StopIcon className="w-5 h-5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <MicrophoneIcon className="w-5 h-5" />
                    <span>Start Recording</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-lg">
            <AudioVisualizer audioData={audioData} />
          </div>

          {recordedBlobs.length > 0 && (
            <div className="bg-surface p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={playRecording}
                  disabled={isPlaying}
                  className="btn btn-secondary inline-flex items-center space-x-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>{isPlaying ? 'Playing...' : 'Play Recording'}</span>
                </button>
                
                <button
                  onClick={downloadRecording}
                  className="btn btn-primary inline-flex items-center space-x-2"
                >
                  <span>Download Recording</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </Page>
  );
};

export default RecordPage;
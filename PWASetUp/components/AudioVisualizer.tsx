import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  audioData: Uint8Array;
  height?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioData, 
  height = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / audioData.length) * 2.5;
      let x = 0;

      for (let i = 0; i < audioData.length; i++) {
        const barHeight = (audioData[i] / 255) * HEIGHT;

        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#6366F1');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  }, [audioData]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="w-full rounded-lg"
    />
  );
};

export default AudioVisualizer;
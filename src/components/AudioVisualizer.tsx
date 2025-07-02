
import { useEffect, useRef } from "react";

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const bars = 40;
    const barWidth = canvas.width / 2 / bars;
    let dataArray = new Uint8Array(bars);

    // Generate random audio data for visualization
    const generateData = () => {
      for (let i = 0; i < bars; i++) {
        dataArray[i] = Math.random() * 255;
      }
    };

    const draw = () => {
      generateData();
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      for (let i = 0; i < bars; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height / 2 - 20);
        const x = i * barWidth;
        const y = (canvas.height / 2 - barHeight) / 2;

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, y + barHeight, 0, y);
        gradient.addColorStop(0, '#ff0040');
        gradient.addColorStop(0.5, '#ff4500');
        gradient.addColorStop(1, '#ffb000');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-20 bg-cyber-dark rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AudioVisualizer;

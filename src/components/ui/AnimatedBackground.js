import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ children, darkMode, intensity = 'medium' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const getIntensityFactor = () => {
      switch (intensity) {
        case 'low': return 0.5;
        case 'high': return 1.5;
        default: return 1;
      }
    };

    const intensityFactor = getIntensityFactor();

    const blobs = [
      { x: 0.2, y: 0.3, radius: canvas.width * 0.2, speed: 0.0002, phase: 0 },
      { x: 0.8, y: 0.7, radius: canvas.width * 0.25, speed: 0.0003, phase: Math.PI / 3 },
      { x: 0.5, y: 0.5, radius: canvas.width * 0.3, speed: 0.0001, phase: Math.PI * 2 / 3 },
    ];

    const drawBlob = (blob, time) => {
      ctx.beginPath();
      const points = 8;
      const breathingFactor = Math.sin(time * 0.5 + blob.phase) * 0.1 + 1;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radiusFactor = 1 + 0.1 * Math.sin(angle * 8 + time * blob.speed * intensityFactor);
        const x = blob.x * canvas.width + Math.cos(angle) * blob.radius * radiusFactor * breathingFactor;
        const y = blob.y * canvas.height + Math.sin(angle) * blob.radius * radiusFactor * breathingFactor;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        blob.x * canvas.width, blob.y * canvas.height, 0,
        blob.x * canvas.width, blob.y * canvas.height, blob.radius * breathingFactor
      );

      if (darkMode) {
        gradient.addColorStop(0, `rgba(6, 182, 212, ${0.1 * breathingFactor})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.05 * breathingFactor})`);
      } else {
        gradient.addColorStop(0, `rgba(6, 182, 212, ${0.05 * breathingFactor})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.02 * breathingFactor})`);
      }

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fond dégradé respirant
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const breathingFactor = Math.sin(time * 0.5) * 0.05 + 1;
      if (darkMode) {
        bgGradient.addColorStop(0, `rgb(${26 * breathingFactor}, ${32 * breathingFactor}, ${44 * breathingFactor})`);
        bgGradient.addColorStop(1, `rgb(${45 * breathingFactor}, ${55 * breathingFactor}, ${72 * breathingFactor})`);
      } else {
        bgGradient.addColorStop(0, `rgb(${230 * breathingFactor}, ${255 * breathingFactor}, ${250 * breathingFactor})`);
        bgGradient.addColorStop(1, `rgb(${178 * breathingFactor}, ${245 * breathingFactor}, ${234 * breathingFactor})`);
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner les blobs
      blobs.forEach(blob => drawBlob(blob, time));

      animationFrameId = requestAnimationFrame((t) => animate(t * 0.001));
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, intensity]);

  return (
    <div className="relative min-h-screen">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
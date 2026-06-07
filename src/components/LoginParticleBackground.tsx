'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function LoginParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 11000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.8,
      }));
    };

    const movePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const leavePointer = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
      glow.addColorStop(0, 'rgba(247, 147, 26, 0.18)');
      glow.addColorStop(1, 'rgba(247, 147, 26, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p, i) => {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          const force = (180 - distance) / 180;
          p.vx += (dx / Math.max(distance, 1)) * force * 0.035;
          p.vy += (dy / Math.max(distance, 1)) * force * 0.035;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = i % 5 === 0 ? 'rgba(247, 147, 26, 0.9)' : 'rgba(255, 255, 255, 0.72)';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const lx = p.x - other.x;
          const ly = p.y - other.y;
          const lineDistance = Math.sqrt(lx * lx + ly * ly);
          if (lineDistance < 105) {
            ctx.strokeStyle = `rgba(247, 147, 26, ${(1 - lineDistance / 105) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', movePointer);
    window.addEventListener('pointerleave', leavePointer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
      window.removeEventListener('pointerleave', leavePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden="true" />;
}

'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  speed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export default function XiaomiBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 120);
      
      const colors = [
        'rgba(247, 147, 26, 0.45)', // Bitcoin Orange
        'rgba(255, 255, 255, 0.3)',  // White
        'rgba(247, 147, 26, 0.2)',  // Darker Orange
        'rgba(226, 232, 240, 0.25)' // Slate
      ];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2.5 + 0.5;
        
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Click handler for ripples
    const handleMouseClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(canvas.width, canvas.height) * 0.45,
        alpha: 0.8,
        speed: Math.max(canvas.width, canvas.height) * 0.008 + 2.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);

    // Animation Loop
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Soft trails suited for light mode
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw active ripples
      ripples = ripples.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.alpha -= 0.012;

        if (ripple.alpha <= 0) return false;

        // Draw multiple nested rings for ripple refraction look
        for (let i = 0; i < 3; i++) {
          const currentRadius = ripple.radius - i * 15;
          if (currentRadius <= 0) continue;

          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(247, 147, 26, ${ripple.alpha * (0.15 - i * 0.04)})`;
          ctx.lineWidth = 2.5 - i * 0.7;
          ctx.stroke();
        }

        return true;
      });

      // Update and Draw particles
      particles.forEach(p => {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse magnetic reaction
        const m = mouseRef.current;
        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 180) {
            // Push particles away gently (fluid dispersion)
            const force = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            const forceX = Math.cos(angle) * force * 0.8;
            const forceY = Math.sin(angle) * force * 0.8;
            
            p.x -= forceX;
            p.y -= forceY;
          } else {
            // Slowly return to natural paths
            p.x += (p.originX - p.x) * p.speed;
            p.y += (p.originY - p.y) * p.speed;
          }
        }

        // Ripple interaction: push particles outward as shockwave passes
        ripples.forEach(r => {
          const dx = p.x - r.x;
          const dy = p.y - r.y;
          const dist = Math.hypot(dx, dy);

          if (Math.abs(dist - r.radius) < 20) {
            const angle = Math.atan2(dy, dx);
            const strength = r.alpha * 4;
            p.x += Math.cos(angle) * strength;
            p.y += Math.sin(angle) * strength;
          }
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Connect particles with very faint lines if close enough
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 95) {
            const alpha = (95 - dist) / 95 * 0.04;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(247, 147, 26, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

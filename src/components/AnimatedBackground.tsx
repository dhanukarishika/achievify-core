import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Enhanced bubble system with multiple types
    const bubbles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      pulseSpeed: number;
      pulsePhase: number;
      type: 'large' | 'medium' | 'small';
    }> = [];

    // Create diverse bubbles
    const createBubbles = () => {
      // Large bubbles (few, slow, prominent)
      for (let i = 0; i < 8; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 60 + 40,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.15 + 0.1,
          hue: Math.random() * 60 + 170,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          type: 'large',
        });
      }

      // Medium bubbles (moderate amount)
      for (let i = 0; i < 15; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 30 + 20,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.2 + 0.15,
          hue: Math.random() * 80 + 160,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
          type: 'medium',
        });
      }

      // Small particles (many, faster)
      for (let i = 0; i < 40; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 8 + 3,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          opacity: Math.random() * 0.4 + 0.2,
          hue: Math.random() * 100 + 150,
          pulseSpeed: Math.random() * 0.05 + 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          type: 'small',
        });
      }
    };

    createBubbles();

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;
      
      // Create beautiful animated gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const hue1 = 210 + Math.sin(time * 0.5) * 15;
      const hue2 = 180 + Math.cos(time * 0.3) * 15;
      gradient.addColorStop(0, `hsla(${hue1}, 70%, 8%, 0.03)`);
      gradient.addColorStop(0.5, `hsla(${(hue1 + hue2) / 2}, 65%, 10%, 0.03)`);
      gradient.addColorStop(1, `hsla(${hue2}, 60%, 12%, 0.03)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble, index) => {
        // Organic movement with sine waves
        const drift = Math.sin(time + index * 0.1) * 0.5;
        bubble.x += bubble.speedX + drift;
        bubble.y += bubble.speedY + Math.cos(time + index * 0.15) * 0.3;

        // Update pulse phase
        bubble.pulsePhase += bubble.pulseSpeed;
        const pulseFactor = 1 + Math.sin(bubble.pulsePhase) * 0.15;

        // Wrap around screen with smooth transition
        if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
        if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;

        const currentRadius = bubble.radius * pulseFactor;

        // Draw bubble with beautiful gradient and glow
        const bubbleGradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, currentRadius
        );

        if (bubble.type === 'large') {
          // Large bubbles: soft multi-color gradient
          bubbleGradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 75%, ${bubble.opacity * 0.8})`);
          bubbleGradient.addColorStop(0.4, `hsla(${bubble.hue + 20}, 90%, 65%, ${bubble.opacity * 0.5})`);
          bubbleGradient.addColorStop(0.7, `hsla(${bubble.hue}, 80%, 55%, ${bubble.opacity * 0.3})`);
          bubbleGradient.addColorStop(1, `hsla(${bubble.hue}, 70%, 45%, 0)`);
        } else if (bubble.type === 'medium') {
          // Medium bubbles: vibrant with glow
          bubbleGradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 70%, ${bubble.opacity})`);
          bubbleGradient.addColorStop(0.5, `hsla(${bubble.hue}, 90%, 60%, ${bubble.opacity * 0.6})`);
          bubbleGradient.addColorStop(1, `hsla(${bubble.hue}, 80%, 50%, 0)`);
        } else {
          // Small particles: bright and sparkly
          bubbleGradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 80%, ${bubble.opacity})`);
          bubbleGradient.addColorStop(0.6, `hsla(${bubble.hue}, 90%, 70%, ${bubble.opacity * 0.4})`);
          bubbleGradient.addColorStop(1, `hsla(${bubble.hue}, 80%, 60%, 0)`);
        }

        // Draw outer glow for large bubbles
        if (bubble.type === 'large') {
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, currentRadius * 1.5, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(
            bubble.x, bubble.y, 0,
            bubble.x, bubble.y, currentRadius * 1.5
          );
          glowGradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 70%, ${bubble.opacity * 0.15})`);
          glowGradient.addColorStop(1, `hsla(${bubble.hue}, 100%, 60%, 0)`);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Draw main bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = bubbleGradient;
        ctx.fill();

        // Add subtle highlight for realism
        if (bubble.type !== 'small') {
          const highlightGradient = ctx.createRadialGradient(
            bubble.x - currentRadius * 0.3,
            bubble.y - currentRadius * 0.3,
            0,
            bubble.x - currentRadius * 0.3,
            bubble.y - currentRadius * 0.3,
            currentRadius * 0.5
          );
          highlightGradient.addColorStop(0, `hsla(0, 0%, 100%, ${bubble.opacity * 0.4})`);
          highlightGradient.addColorStop(1, `hsla(0, 0%, 100%, 0)`);
          ctx.fillStyle = highlightGradient;
          ctx.fill();
        }
      });

      // Connect nearby bubbles with soft lines
      bubbles.forEach((bubble, i) => {
        if (bubble.type === 'small') return; // Skip small particles for connections
        
        bubbles.slice(i + 1).forEach((otherBubble) => {
          if (otherBubble.type === 'small') return;
          
          const dx = bubble.x - otherBubble.x;
          const dy = bubble.y - otherBubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(bubble.x, bubble.y);
            ctx.lineTo(otherBubble.x, otherBubble.y);
            const avgHue = (bubble.hue + otherBubble.hue) / 2;
            const connectionOpacity = (1 - distance / 200) * 0.1;
            ctx.strokeStyle = `hsla(${avgHue}, 100%, 60%, ${connectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-40"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;

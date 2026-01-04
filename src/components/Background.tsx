import React, { useEffect, useRef } from "react";

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Bubble data
    const bubbles: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      drift: number;
      opacity: number;
    }[] = [];

    const createBubbles = () => {
      for (let i = 0; i < 40; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 8 + Math.random() * 25,
          speed: 0.3 + Math.random() * 0.8,
          drift: Math.random() * 0.4 - 0.2,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
    };

    const drawBubble = (x: number, y: number, r: number, opacity: number) => {
      const gradient = ctx.createRadialGradient(
        x - r / 3,
        y - r / 3,
        r * 0.1,
        x,
        y,
        r
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity + 0.3})`);
      gradient.addColorStop(0.5, `rgba(173, 216, 230, ${opacity})`); // light blue tint
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Add soft rim highlight
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity + 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      // Background gradient: soft sky blue → white
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#a8dbff"); // soft sky blue
      gradient.addColorStop(1, "#f4fbff"); // very pale white-blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw bubbles
      for (const b of bubbles) {
        drawBubble(b.x, b.y, b.radius, b.opacity);
        b.y -= b.speed;
        b.x += b.drift;

        if (b.y + b.radius < 0) {
          b.y = height + b.radius;
          b.x = Math.random() * width;
        }
      }

      requestAnimationFrame(animate);
    };

    createBubbles();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
  <canvas
    ref={canvasRef}
    className="fixed top-0 left-0 w-full h-full"
    style={{
      zIndex: -1,              // 👈 this ensures it stays *behind* all content
      background: "transparent",
      pointerEvents: "none",
    }}
  />
);

};

export default Background;

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Eraser, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CanvasDoodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store the context in a ref to access it in handlers without re-triggering effects
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#88ccff');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#88ccff', '#cc88ff', '#88ffcc', '#ffcc88', '#ff88cc',
    '#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'
  ];

  // This is the background color. We need it for the eraser.
  const CANVAS_BACKGROUND = 'rgba(10, 22, 40, 0.5)';

  // --- Canvas Setup and Responsive Resizing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    // Function to handle resizing
    const resizeCanvas = () => {
      // Get the size of the canvas element
      const rect = canvas.getBoundingClientRect();
      // Get the device pixel ratio for high-DPI screens
      const dpr = window.devicePixelRatio || 1;

      // Set the *drawing buffer* size, scaled by DPR
      // This ensures the drawing is sharp
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale the context to match the DPR
      // Now, all drawing operations are in "CSS pixels"
      ctx.scale(dpr, dpr);

      // Redraw the background
      // We use rect.width/height because the context is scaled
      fillBackground(ctx, rect.width, rect.height);
    };

    // Use ResizeObserver to automatically resize when the element changes
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // Initial resize
    resizeCanvas();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // --- Helper Functions ---

  // Fills the canvas with the background color
  const fillBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, width, height);
  };

  // Gets the correct (x, y) coordinates for both mouse and touch events
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Coordinates are relative to the canvas element (CSS pixels)
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // --- Drawing Event Handlers ---

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const ctx = ctxRef.current;
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    setIsDrawing(true);
    ctx.beginPath(); // Start a new path
    ctx.moveTo(coords.x, coords.y); // Move "pen" to the starting point
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    // Setup line properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over'; // Default drawing mode

    if (tool === 'eraser') {
      // ✅ FIX: "Erase" by drawing with the background color
      ctx.strokeStyle = CANVAS_BACKGROUND;
      ctx.lineWidth = 20;
    } else {
      // Draw with the selected color
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
    }

    // ✅ FIX: Only draw a line and stroke it.
    // Do NOT beginPath() or moveTo() here.
    ctx.lineTo(coords.x, coords.y); // Draw line to new point
    ctx.stroke(); // Render the line
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    setIsDrawing(false);
    if (ctx) {
      ctx.beginPath(); // "Lift the pen"
    }
  };

  // --- Toolbar Functions ---

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Get the element's CSS size
    const rect = canvas.getBoundingClientRect();
    
    // Clear the canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Redraw the background
    fillBackground(ctx, rect.width, rect.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* ✅ FIX: Added pointer-events-none to the Card to let clicks pass through */}
      <Card className="glass-strong p-6 relative pointer-events-none">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gradient mb-2">Canvas Doodle</h2>
          <p className="text-muted-foreground">
            Express your creativity! Draw freely on the canvas
          </p>
        </div>

        {/* Toolbar */}
        {/* ✅ FIX: Added pointer-events-auto to the toolbar wrapper */}
        <div className="flex flex-wrap gap-2 mb-4 pointer-events-auto">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Draw
          </Button>

          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="gap-2"
          >
            <Eraser className="w-4 h-4" />
            Erase
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            <div 
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: color }}
            />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={clearCanvas}
            className="gap-2 ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          /* ✅ FIX: Added pointer-events-auto to the color picker wrapper */
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 mb-4 p-3 glass rounded-lg pointer-events-auto"
          >
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool('pen');
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-white scale-110' : 'border-white/30'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </motion.div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          // --- Event Handlers ---
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          // ---
          // ✅ FIX: Added pointer-events-auto to the canvas
          className="w-full h-[400px] rounded-lg cursor-crosshair border border-white/10 relative z-10 pointer-events-auto"
          // ---
          // Prevent page scrolling while drawing on touch devices
          style={{ touchAction: 'none' }}
        />
      </Card>
    </motion.div>
  );
};

export default CanvasDoodle;


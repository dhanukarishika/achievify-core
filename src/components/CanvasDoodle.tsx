import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Eraser, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CanvasDoodle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#88ccff');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#88ccff', '#cc88ff', '#88ffcc', '#ffcc88', '#ff88cc',
    '#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with semi-transparent dark background
    ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = tool === 'eraser' ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(10, 22, 40, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="glass-strong p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gradient mb-2">Canvas Doodle</h2>
          <p className="text-muted-foreground">
            Express your creativity! Draw freely on the canvas
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4">
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 mb-4 p-3 glass rounded-lg"
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
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-[400px] rounded-lg cursor-crosshair glass border border-white/10"
          style={{ touchAction: 'none' }}
        />
      </Card>
    </motion.div>
  );
};

export default CanvasDoodle;

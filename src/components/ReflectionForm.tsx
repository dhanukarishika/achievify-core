import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ReflectionForm = () => {
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('reflections').insert([
      {
        user_id: user.id,
        content: content,
        date: new Date().toISOString().split('T')[0],
      },
    ]);

    if (error) {
      toast({
        title: "Error saving reflection",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setContent('');
      setIsOpen(false);
      toast({
        title: "Reflection saved!",
        description: "Your daily reflection has been recorded.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full gradient-accent shadow-glow h-auto py-8">
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-8 h-8" />
              <span className="text-lg font-semibold">Write Daily Reflection</span>
              <span className="text-sm opacity-90">Share your thoughts and feelings</span>
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="glass-strong border-glass-border shadow-glass">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Daily Reflection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="How was your day? What did you learn? What are you grateful for?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="glass border-glass-border min-h-[200px]"
          />
          <Button onClick={handleSubmit} className="w-full gradient-primary shadow-glow">
            Save Reflection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReflectionForm;

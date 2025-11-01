import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimatedBackground3D from '@/components/AnimatedBackground3D';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Reflection {
  id: string;
  content: string;
  date: string;
  created_at: string;
}

const Reflections = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchReflections();
    subscribeToReflections();
  }, []);

  const fetchReflections = async () => {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching reflections",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setReflections(data || []);
    }
  };

  const subscribeToReflections = () => {
    const channel = supabase
      .channel('reflections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reflections',
        },
        () => {
          fetchReflections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const deleteReflection = async (id: string) => {
    const { error } = await supabase.from('reflections').delete().eq('id', id);

    if (error) {
      toast({
        title: "Error deleting reflection",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reflection deleted",
        description: "Your reflection has been removed.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen gradient-bg relative">
      <AnimatedBackground3D />
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-3 text-gradient">My Reflections</h1>
            <p className="text-xl text-muted-foreground">
              Your journey of thoughts and growth
            </p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {reflections.map((reflection, index) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-strong rounded-2xl p-6 shadow-glass"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatDate(reflection.date)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteReflection(reflection.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {reflection.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {reflections.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-strong rounded-2xl p-12 text-center shadow-glass"
              >
                <p className="text-muted-foreground text-lg">
                  No reflections yet. Start writing your first reflection from the dashboard!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reflections;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimatedBackground3D from '@/components/AnimatedBackground3D';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit feedback.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: user.id,
            message: message.trim(),
            rating: rating,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve Achievify.",
      });
      
      setMessage('');
      setRating(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative">
      <AnimatedBackground3D />
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-3 text-gradient">Share Your Feedback</h1>
            <p className="text-xl text-muted-foreground">
              Help us improve Achievify! Your thoughts matter to us.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-strong p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5" />
                    Rate Your Experience
                  </Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
                      {rating === 2 && "Thank you for your feedback. We'll work on improving."}
                      {rating === 3 && "Thanks! Tell us what we can do better."}
                      {rating === 4 && "Great! We'd love to hear what you enjoyed."}
                      {rating === 5 && "Awesome! We're thrilled you love Achievify!"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Your Feedback
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your experience, suggestions, or report any issues..."
                    rows={6}
                    required
                    className="glass border-glass-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary shadow-glow py-6"
                  disabled={loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;

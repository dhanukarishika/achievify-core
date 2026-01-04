import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedBackground3D from '@/components/AnimatedBackground3D';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Animation variants for staggered list
const formItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.1, duration: 0.3 },
  }),
};

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // For inline errors
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null); // Clear previous errors

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---

        // 1. Create user in Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });

        if (error) throw error;
        if (!data.user) throw new Error("User creation failed.");

        // ✅ 2. (FIX) Immediately sign out to force manual login
        // This handles the case where "Confirm email" is OFF in Supabase
        if (data.session) {
          await supabase.auth.signOut();
        }

        // 3. (✅ SECURITY FIX) Store user in your backend DB
        // *NEVER* send the plain-text password. Send the Supabase user ID.
        try {
          await axios.post('http://localhost:8080/api/users', {
            email,
            password, // Store this ID
          });
        } catch (backendError: any) {
          // If backend sync fails, the user exists in Supabase but not your DB.
          // This is a complex distributed transaction issue.
          // For now, we'll alert the user.
          console.error("Backend user creation failed:", backendError);
          throw new Error(
            `Account created, but failed to sync with our records. Please contact support.`,
          );
        }

        toast({
          title: "Account Created!",
          description: "Please log in using your new credentials.",
        });

        // Switch to login view and clear fields
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      } else {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Display error inline and in a toast
      setFormError(error.message);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative flex items-center justify-center px-6">
      <AnimatedBackground3D />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-glass">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-glow animate-float">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Achievify</h1>
            <p className="text-muted-foreground text-center">
              Your personal productivity & motivation tracker
            </p>
          </div>

          {/* ✨ Animated Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-semibold text-center mb-6"
            >
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </motion.h2>
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-6">
            {/* ✨ Staggered Email Field */}
            <motion.div
              className="space-y-2"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass border-glass-border"
                autoComplete="email"
              />
            </motion.div>

            {/* ✨ Staggered Password Field */}
            <motion.div
              className="space-y-2"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass border-glass-border"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </motion.div>

            {/* ✨ Inline Error Message */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-center text-sm text-red-400"
                >
                  {formError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <Button
                type="submit"
                className="w-full gradient-primary shadow-glow py-6"
                disabled={loading}
              >
                {loading
                  ? 'Loading...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormError(null); // Clear errors on toggle
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'Don’t have an account? Sign up'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
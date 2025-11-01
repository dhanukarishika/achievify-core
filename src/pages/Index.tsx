import AnimatedBackground3D from '@/components/AnimatedBackground3D';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Sparkles, TrendingUp, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg relative">
      <AnimatedBackground3D />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl gradient-primary shadow-glow animate-float">
            <Target className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient">
            Welcome to Achievify
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal productivity companion. Track tasks, reflect on your journey, 
            and stay motivated every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary shadow-glow text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="glass-strong text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong p-6 rounded-2xl"
            >
              <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your daily tasks and achievements with ease
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong p-6 rounded-2xl"
            >
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Stay Motivated</h3>
              <p className="text-muted-foreground">
                Daily quotes and motivational content to keep you inspired
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-strong p-6 rounded-2xl"
            >
              <Calendar className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Reflect & Grow</h3>
              <p className="text-muted-foreground">
                Journal your thoughts and watch yourself grow over time
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

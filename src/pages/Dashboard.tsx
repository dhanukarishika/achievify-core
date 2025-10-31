import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import QuoteSection from '@/components/QuoteSection';
import TaskList from '@/components/TaskList';
import ReflectionForm from '@/components/ReflectionForm';

const Dashboard = () => {
  return (
    <div className="min-h-screen gradient-bg relative">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-3 text-gradient">Welcome Back!</h1>
            <p className="text-xl text-muted-foreground">
              Let's make today productive and meaningful
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TaskList />
            </div>
            
            <div className="space-y-6">
              <QuoteSection />
              <ReflectionForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

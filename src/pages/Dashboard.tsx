import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AnimatedBackground3D from '@/components/AnimatedBackground3D';
import QuoteSection from '@/components/QuoteSection';
import TaskList from '@/components/TaskList';
import ReflectionForm from '@/components/ReflectionForm';
import TimetableUpload from '@/components/TimetableUpload';
import MotivationVideos from '@/components/MotivationVideos';
import CanvasDoodle from '@/components/CanvasDoodle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  return (
    <div className="min-h-screen gradient-bg relative">
      <AnimatedBackground3D />
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

          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="tasks">Tasks & Reflections</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="motivation">Motivation</TabsTrigger>
              <TabsTrigger value="doodle">Doodle</TabsTrigger>
              <TabsTrigger value="quotes">Daily Quote</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <TaskList />
                </div>
                
                <div className="space-y-6">
                  <ReflectionForm />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timetable">
              <TimetableUpload />
            </TabsContent>

            <TabsContent value="motivation">
              <MotivationVideos />
            </TabsContent>

            <TabsContent value="doodle">
              <CanvasDoodle />
            </TabsContent>

            <TabsContent value="quotes">
              <QuoteSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

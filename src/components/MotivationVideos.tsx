import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { PlayCircle } from 'lucide-react';
import motivationImg1 from '@/assets/motivation-1.jpg';
import motivationImg2 from '@/assets/motivation-2.jpg';
import motivationImg3 from '@/assets/motivation-3.jpg';

const MotivationVideos = () => {
  const videos = [
    {
      id: 1,
      title: "The Power of Consistency",
      description: "Learn why small daily actions lead to massive results",
      videoId: "IdTMDpizis8",
      thumbnail: motivationImg1
    },
    {
      id: 2,
      title: "Overcoming Procrastination",
      description: "Beat procrastination and take action today",
      videoId: "mhFQA998WiA",
      thumbnail: motivationImg2
    },
    {
      id: 3,
      title: "Success Mindset",
      description: "Develop the mindset of successful people",
      videoId: "ZXsQAXx_ao0",
      thumbnail: motivationImg3
    }
  ];

  const motivationalImages = [
    {
      id: 4,
      title: "Reach Your Peak",
      description: "Every step forward is progress",
      image: motivationImg1
    },
    {
      id: 5,
      title: "Take The Leap",
      description: "Courage is taking action despite fear",
      image: motivationImg2
    },
    {
      id: 6,
      title: "Your Journey Awaits",
      description: "The path to success is illuminated by your dreams",
      image: motivationImg3
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gradient">Motivational Videos</h2>
        <p className="text-muted-foreground mb-6">
          Watch these inspiring videos to boost your motivation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden group cursor-pointer">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gradient">Inspirational Quotes</h2>
        <p className="text-muted-foreground mb-6">
          Let these images inspire your journey
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {motivationalImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden group">
                <div className="relative h-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-white/90 text-sm">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MotivationVideos;
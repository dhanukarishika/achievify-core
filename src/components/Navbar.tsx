import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, LogOut, Target, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate('/auth');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/reflections', icon: FileText, label: 'Reflections' },
    { path: '/contact', icon: Mail, label: 'Feedback' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-strong rounded-2xl px-6 py-3 shadow-glass">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Achievify</span>
          </Link>

          <div className="flex items-center gap-2">
            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 mr-2">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{userEmail}</span>
              </div>
            )}
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  size="sm"
                  className={location.pathname === item.path ? 'gradient-primary shadow-glow' : ''}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

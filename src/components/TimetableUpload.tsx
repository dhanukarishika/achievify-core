import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Trash2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';

const TimetableUpload = () => {
  const [timetableFile, setTimetableFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.storage
      .from('timetables')
      .list(`${user.id}/`);

    if (error) {
      console.error('Error loading timetable:', error);
      return;
    }

    if (data && data.length > 0) {
      const { data: urlData } = await supabase.storage
        .from('timetables')
        .createSignedUrl(`${user.id}/${data[0].name}`, 3600);

      if (urlData) {
        setTimetableFile({ name: data[0].name, url: urlData.signedUrl });
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete old file if exists
    if (timetableFile) {
      await supabase.storage
        .from('timetables')
        .remove([`${user.id}/${timetableFile.name}`]);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `timetable_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('timetables')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive"
      });
      setUploading(false);
      return;
    }

    toast({
      title: "Success!",
      description: "Timetable uploaded successfully"
    });

    setUploading(false);
    loadTimetable();
  };

  const handleDelete = async () => {
    if (!timetableFile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.storage
      .from('timetables')
      .remove([`${user.id}/${timetableFile.name}`]);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Deleted",
      description: "Timetable removed successfully"
    });
    setTimetableFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-gradient">Your Timetable</h2>
        
        {!timetableFile ? (
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground mb-4">
              Upload your timetable (PDF, PNG, JPG)
            </p>
            <label htmlFor="timetable-upload">
              <Button disabled={uploading} className="cursor-pointer">
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                id="timetable-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{timetableFile.name}</p>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={timetableFile.url} download target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </a>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            {timetableFile.url && timetableFile.name.match(/\.(jpg|jpeg|png)$/i) && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={timetableFile.url} 
                  alt="Timetable" 
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {timetableFile.url && timetableFile.name.match(/\.pdf$/i) && (
              <iframe
                src={timetableFile.url}
                className="w-full h-[600px] rounded-lg"
                title="Timetable PDF"
              />
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default TimetableUpload;
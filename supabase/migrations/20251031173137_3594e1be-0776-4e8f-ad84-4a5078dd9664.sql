-- Create storage bucket for timetables
INSERT INTO storage.buckets (id, name, public) 
VALUES ('timetables', 'timetables', false);

-- Create policies for timetable uploads
CREATE POLICY "Users can view their own timetables"
ON storage.objects FOR SELECT
USING (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own timetables"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own timetables"
ON storage.objects FOR UPDATE
USING (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own timetables"
ON storage.objects FOR DELETE
USING (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);
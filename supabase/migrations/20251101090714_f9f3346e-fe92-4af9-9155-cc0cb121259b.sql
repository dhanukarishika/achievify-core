-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own feedback"
ON public.feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
ON public.feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
ON public.feedback
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
ON public.feedback
FOR DELETE
USING (auth.uid() = user_id);
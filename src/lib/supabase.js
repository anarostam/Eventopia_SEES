import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to create feedback table
export async function createFeedbackTable() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .limit(1)

  if (error) {
    // Table doesn't exist, create it
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create feedback table
        CREATE TABLE IF NOT EXISTS public.feedback (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            event_id BIGINT NOT NULL REFERENCES public.event(id) ON DELETE CASCADE,
            user_email TEXT NOT NULL REFERENCES public.profiles(email) ON DELETE CASCADE,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            UNIQUE(event_id, user_email)
        );

        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS feedback_event_id_idx ON public.feedback(event_id);
        CREATE INDEX IF NOT EXISTS feedback_user_email_idx ON public.feedback(user_email);

        -- Enable Row Level Security (RLS)
        ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Enable read access for all users" ON public.feedback
            FOR SELECT USING (true);

        CREATE POLICY "Enable insert for authenticated users" ON public.feedback
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Enable update for feedback owners" ON public.feedback
            FOR UPDATE USING (auth.email() = user_email);

        CREATE POLICY "Enable delete for feedback owners" ON public.feedback
            FOR DELETE USING (auth.email() = user_email);

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION public.handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = timezone('utc'::text, now());
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create trigger for updated_at
        CREATE TRIGGER handle_feedback_updated_at
            BEFORE UPDATE ON public.feedback
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
      `
    })

    if (createError) {
      console.error('Error creating feedback table:', createError)
      return { error: createError }
    }
  }

  return { success: true }
} 
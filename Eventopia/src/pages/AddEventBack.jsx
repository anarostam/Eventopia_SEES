import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project values
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

export const AddEventBack = async ({ eventName, date, time, venue, description, picture }) => {
  try {
    // Step 1: Upload picture to Supabase Storage
    let pictureUrl = null;

    if (picture) {
      const fileExt = picture.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-pictures')
        .upload(filePath, picture);

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message);
        return { success: false, message: 'Image upload failed' };
      }

      const { data: publicUrlData } = supabase.storage
        .from('event-pictures')
        .getPublicUrl(filePath);

      pictureUrl = publicUrlData.publicUrl;
    }

console.log('Inserting into event table with:', {
    name: eventName,
    date,
    time,
    venue,
    description,
    picture_url: pictureUrl,
  });
  
  const { error: insertError } = await supabase.from('event').insert([
    {
      name: eventName,
      date,
      time,
      venue,
      description,
      picture_url: pictureUrl,
    },
  ]);
  
if (insertError) {
    console.error('Insert failed:', insertError); // Show the full error
    return { success: false, message: insertError.message || 'Unknown error' };
  }
  
    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, message: 'Unexpected error occurred' };
  }
};

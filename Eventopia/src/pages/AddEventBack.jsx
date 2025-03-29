import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

export const AddEventBack = async ({ eventName, date, time, venue, description, picture, price }) => {
  try {
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
      price,
      picture_url: pictureUrl,
    });

    const { error: insertError } = await supabase.from('event').insert([
      {
        name: eventName,
        date,
        time,
        venue,
        description,
        price: parseFloat(price) || 0, // ✅ insert price
        picture_url: pictureUrl,
      },
    ]);

    if (insertError) {
      console.error('Insert failed:', insertError);
      return { success: false, message: insertError.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, message: 'Unexpected error occurred' };
  }
};

// ✅ Update with price support
export const updateEvent = async ({ id, name, date, venue, description, picture_url, time, price }) => {
  try {
    let pictureUrl = null;

    if (picture_url && typeof picture_url === 'object') {
      const fileExt = picture_url.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-pictures')
        .upload(filePath, picture_url);

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message);
        return { success: false, message: 'Image upload failed' };
      }

      const { data: publicUrlData } = await supabase.storage
        .from('event-pictures')
        .getPublicUrl(filePath);

      pictureUrl = publicUrlData.publicUrl;
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (date) updateFields.date = date;
    if (venue) updateFields.venue = venue;
    if (description) updateFields.description = description;
    if (pictureUrl) updateFields.picture_url = pictureUrl;
    if (time) updateFields.time = time;
    if (price !== undefined) updateFields.price = parseFloat(price); // ✅ update price

    const { error: updateError } = await supabase
      .from('event')
      .update(updateFields)
      .eq('id', id);

    if (updateError) {
      console.error('Update failed:', updateError.message);
      return { success: false, message: updateError.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, message: 'Unexpected error occurred' };
  }
};

export const deleteEvent = async (id) => {
  try {
    const { error: paymentError } = await supabase
      .from('payments')
      .delete()
      .eq('eventID', id);

    if (paymentError) {
      console.error('Failed to delete related payments:', paymentError.message);
      return { success: false, message: 'Failed to delete related payments' };
    }

    const { error: deleteError } = await supabase
      .from('event')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete failed:', deleteError.message);
      return { success: false, message: deleteError.message || 'Unknown error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, message: 'Unexpected error occurred' };
  }
};
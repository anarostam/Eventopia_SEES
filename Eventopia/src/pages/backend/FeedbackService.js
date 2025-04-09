import { supabase } from "../../Client";

export const submitFeedback = async (eventId, rating) => {
  try {
    // Get the current user's email
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { success: false, message: 'Error getting user information' };
    }

    if (!user) {
      return { success: false, message: 'User not logged in' };
    }

    // Check if user has already submitted feedback for this event
    const { data: existingFeedback, error: checkError } = await supabase
      .from('feedback')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_email', user.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking existing feedback:', checkError);
      return { success: false, message: 'Error checking existing feedback' };
    }

    if (existingFeedback) {
      // Update existing feedback
      const { error: updateError } = await supabase
        .from('feedback')
        .update({ rating, updated_at: new Date() })
        .eq('id', existingFeedback.id);

      if (updateError) {
        console.error('Error updating feedback:', updateError);
        return { success: false, message: 'Error updating feedback' };
      }

      return { success: true, message: 'Feedback updated successfully' };
    }

    // Insert new feedback
    const { error: insertError } = await supabase
      .from('feedback')
      .insert([
        {
          event_id: eventId,
          user_email: user.email,
          rating,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

    if (insertError) {
      console.error('Error submitting feedback:', insertError);
      return { success: false, message: 'Error submitting feedback' };
    }

    return { success: true, message: 'Feedback submitted successfully' };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const getFeedback = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching feedback:', error);
      return { success: false, message: 'Error fetching feedback' };
    }

    if (!data || data.length === 0) {
      return { success: true, average: 0, count: 0 };
    }

    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / data.length;

    return { 
      success: true, 
      average: parseFloat(average.toFixed(1)), 
      count: data.length 
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}; 
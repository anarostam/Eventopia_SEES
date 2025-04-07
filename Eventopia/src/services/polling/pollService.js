const { supabase } = require('../../Client');

class PollService {
  async createPoll(speaker_id, question, options) {
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert([{ question, speaker_id}])
      .select()
      .single();

    if (pollError) throw pollError;

    const pollOptions = options.map(option => ({
      poll_id: poll.id,
      option,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) throw optionsError;

    return poll;
  }

  async submitVote(user_id, poll_id, option_id) {
    const { data: existingVote, error: checkError } = await supabase
      .from('poll_responses')
      .select('*')
      .eq('poll_id', poll_id)
      .eq('respondent', user_id)
      .maybeSingle();
  
    if (checkError) throw checkError;
    if (existingVote) {
      throw new Error('User has already voted in this poll.');
    }
  
    const { error: insertError } = await supabase
      .from('poll_responses')
      .insert([{ respondent: user_id, poll_id, option_id }]);
  
    if (insertError) throw insertError;
  
    return { message: 'Vote submitted successfully' };
  }
  

  async viewActivePoll() {
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        poll_options (
          id,
          option
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false }) // In case multiple, get latest
      .limit(1)
      .single();
  
    if (error) throw error;
    return poll;
  }
  
  async getAllPolls() {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        poll_options (
          id,
          option
        )
      `)
      .order('created_at', { ascending: false });
  
    if (error) throw error;
    return data;
  }
  

  async getPollResults(poll_id) {
    const { data, error } = await supabase
      .from('poll_options')
      .select('id, option, poll_responses(count)')
      .eq('poll_id', poll_id);

    if (error) throw error;
    return data;
  } 
}



module.exports = new PollService();
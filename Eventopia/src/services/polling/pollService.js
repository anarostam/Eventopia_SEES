const { supabase } = require('../../Client'); // your Supabase client instance

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
// Check if the user has already voted in this poll
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
      .insert([{ user_id, poll_id, option_id }]);

    if (insertError) throw insertError;

    return { message: 'Vote submitted successfully' };
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
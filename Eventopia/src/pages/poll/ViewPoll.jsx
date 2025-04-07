import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Client';
import pollService from '../../services/polling/pollService';
import '../../Css-folder/ViewPoll.css';

const ViewPoll = () => {
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPollAndUser = async () => {
      try {
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !sessionData.user) {
          navigate('/login');
          return;
        }

        
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('id')
          .eq('email', sessionData.user.email)
          .single();

        if (userError) {
          setError('Failed to fetch user.');
          return;
        }

        setUserId(userData.id);

  
        const pollData = await pollService.viewActivePoll();
        setPoll(pollData);
      } catch (err) {
        setError(err.message || 'Error loading poll.');
      }
    };

    loadPollAndUser();
  }, [navigate]);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setError('Please select an option.');
      return;
    }

    try {
      setIsSubmitting(true);
      await pollService.submitVote(userId, poll.id, selectedOption);
      alert('Vote submitted!');
    } catch (err) {
      setError(err.message || 'Vote failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-poll-page">
      {poll ? (
        <>
          <h2>{poll.question}</h2>

          {error && <div className="view-poll-error">{error}</div>}

          <form onSubmit={handleVoteSubmit}>
            <div className="view-poll-options">
              {poll.poll_options.map((option) => (
                <div key={option.id} className="view-poll-option">
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="pollOption"
                    value={option.id}
                    className="view-poll-radio"
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <label htmlFor={`option-${option.id}`} className="view-poll-label">
                    {option.option}
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" className="view-poll-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </button>
          </form>
        </>
      ) : (
        <p>Loading active poll...</p>
      )}
    </div>
  );
};

export default ViewPoll;

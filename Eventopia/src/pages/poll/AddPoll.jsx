import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Client';
import pollService from '../../services/polling/pollService';
import '../../Css-folder/AddPoll.css';

const AddPoll = () => {
  const navigate = useNavigate();

  const [pollData, setPollData] = useState({
    question: '',
    options: ['', '']
  });

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchUser = async () => {
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
        setError('Error fetching user data.');
        return;
      }

      
      setUserId(userData.id);
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    setPollData({ ...pollData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...pollData.options];
    updatedOptions[index] = value;
    setPollData({ ...pollData, options: updatedOptions });
  };

  const addOption = () => {
    setPollData({ ...pollData, options: [...pollData.options, ''] });
  };

  const removeOption = (index) => {
    if (pollData.options.length <= 2) return;
    const updatedOptions = [...pollData.options];
    updatedOptions.splice(index, 1);
    setPollData({ ...pollData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User must be logged in to create a poll.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const validOptions = pollData.options.filter(opt => opt.trim() !== '');
      if (!pollData.question.trim()) {
        throw new Error('Poll question is required.');
      }
      if (validOptions.length < 2) {
        throw new Error('At least two valid options are required.');
      }

      
      await pollService.createPoll(userId, pollData.question.trim(), validOptions);

      navigate('/PollConfirmation');
    } catch (err) {
      setError(err.message || 'Failed to create poll.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-poll-container">
      <h2>Create a New Poll</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Poll Question</label>
          <input
            type="text"
            id="question"
            name="question"
            value={pollData.question}
            onChange={handleInputChange}
            placeholder="Enter your question"
            required
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          {pollData.options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required={index < 2}
              />
              {index > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addOption}>
            Add Option
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};

export default AddPoll;

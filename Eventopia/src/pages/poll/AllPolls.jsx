import React, { useEffect, useState } from 'react';
import { supabase } from '../../Client';
import pollService from '../../services/polling/pollService';
import '../../Css-folder/ViewPoll.css';

const AllPolls = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const allPolls = await pollService.getAllPolls();
        setPolls(allPolls);
      } catch (err) {
        setError(err.message || 'Error loading polls.');
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="view-poll-page">
      <h2>All Polls</h2>
      {error && <div className="view-poll-error">{error}</div>}
      {polls.map((poll) => (
        <div key={poll.id} className="view-poll-question-block">
          <h3>{poll.question}</h3>
          <ul>
            {poll.poll_options.map((opt) => (
              <li key={opt.id}>{opt.option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AllPolls;

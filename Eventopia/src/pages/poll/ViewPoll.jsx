import React, { useState } from 'react';
import '../../Css-folder/ViewPoll.css';

const ViewPoll = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const poll = {
    question: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green', 'Yellow']
  };

  const handleVoteSubmit = (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert('Please select an option before submitting your vote.');
    } else {
      alert('Vote submitted successfully!');
    }
  };

  return (
    <div className="view-poll-page">
      <h2>{poll ? poll.question : 'Loading poll...'}</h2>

      <form onSubmit={handleVoteSubmit}>
        <div className="view-poll-options">
          {poll.options.map((option, index) => (
            <div key={index} className="view-poll-option">
              <input
                type="radio"
                id={`option-${index}`}
                name="pollOption"
                value={option}
                onChange={() => setSelectedOption(option)}
                className="view-poll-radio"
              />
              <label htmlFor={`option-${index}`} className="view-poll-label">{option}</label>
            </div>
          ))}
        </div>

        <button type="submit" className="view-poll-submit-btn">
          Submit Vote
        </button>
      </form>
    </div>
  );
};

export default ViewPoll;

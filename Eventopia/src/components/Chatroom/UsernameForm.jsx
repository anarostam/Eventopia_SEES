import React, { useState } from 'react';
import { socket } from '../socket';

function UsernameForm({ setUsername }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    socket.emit('set_username', input);
    setUsername(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Enter your name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Join</button>
    </form>
  );
}

export default UsernameForm;

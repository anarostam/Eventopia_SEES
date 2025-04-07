import React, { useState, useEffect } from 'react';
import { socket } from '../../Socket';

function ChatWindow({ selectedUser, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('receive_private_message', ({ message, from }) => {
      if (from === selectedUser.id) {
        setMessages((prev) => [...prev, { sender: from, text: message }]);
      }
    });

    return () => {
      socket.off('receive_private_message');
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (!input) return;
    socket.emit('send_private_message', {
      to: selectedUser.id,
      message: input,
      from: socket.id,
    });
    setMessages((prev) => [...prev, { sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <div>
      <h3>Chat with {selectedUser.name}</h3>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index}><b>{msg.sender === 'me' ? 'You' : selectedUser.name}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;

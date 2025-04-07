import React, { useEffect, useState } from 'react';
import { socket } from '../../Socket';
import { supabase } from '../../Client';
import { useMessages } from './MessageList';
import { useChatMessages } from './MessageInput';
import { useAudioRecorder } from './AudioRecorder';

function ChatRoomback({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isRecording, setIsRecording] = useState(false); 

  const {
    messages,
    setMessages,
    input,
    setInput,
    editMode,
    sendMessage,
    editMessage,
    updateMessage,
    deleteMessage
  } = useChatMessages({ selectedUser, currentUser });

  const { audioUrl, startRecording, uploadAudio, stopRecording } = useAudioRecorder();
  const { messages: fetchedMessages } = useMessages({ selectedUser, currentUser });

  useEffect(() => {
    if (currentUser) {
      const name = currentUser.name || currentUser.email;
      socket.emit('register_user', {
        userId: currentUser.id,
        name,
      });
      console.log("Registered current user:", currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('id, name, email');

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setMessages(fetchedMessages); 
    }
  }, [selectedUser, fetchedMessages, setMessages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      sendMessage(); 
    } else {
      
      await handleAudioMessage();
    }
  };

  
  const handleAudioMessage = async () => {
    setIsRecording(true); // Start recording when message is empty
    await startRecording();

    setTimeout(async () => {
      const uploadedUrl = await uploadAudio(); // Upload the audio after recording
      setIsRecording(false); // Stop recording
      try{
        const { data: userData, error: userError } = await supabase
                .from('user')
                .select('id')
                .eq('email', currentUser.email)
                .single();
        
              if (userError) {
                console.error("Error fetching user id:", userError.message);
                return;
              }

          const fromUserId = userData.id;
      const toUserId = selectedUser.id;
      if (uploadedUrl) {
        const newMessage = {
          sender: 'You',
          receiver: selectedUser.email,
          text: '',
          audioUrl: uploadedUrl,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Save the audio message in the database
        const { error } = await supabase.from('messages').insert([{
          from_id: fromUserId,
            to_id: toUserId,
          text: '',
          audio_url: uploadedUrl,
        }]);

        if (error) {
          console.error("Error saving audio message:", error.message);
        }
      } else {
        console.error("Error uploading audio message");
      }}catch (error) {
        console.error("Error sending message:", error);
      }
    }, 5500); // 5.5 sec to match audio recording duration
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleEditMessage = (messageId, messageText) => {
    editMessage(messageId, messageText);
  };

  const handleUpdateMessage = () => {
    updateMessage();
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
  };

  const otherUsers = users.filter(
    (u) => u.email.trim().toLowerCase() !== currentUser.email.trim().toLowerCase()
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chatroom</h2>

      <div>
        <h3>All Users</h3>
        {otherUsers.length === 0 ? (
          <p>No other users available to chat.</p>
        ) : (
          otherUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setMessages([]);
              }}
              style={{ display: 'block', marginBottom: '5px' }}
            >
              {u.name || u.email}
            </button>
          ))
        )}
      </div>

      {selectedUser && (
        <div style={{ marginTop: '20px' }}>
          <h4>Chat with {selectedUser.name || selectedUser.email}</h4>

          <div style={{
            border: '1px solid #ccc',
            height: 200,
            overflowY: 'scroll',
            padding: 10,
            marginBottom: 10
          }}>
            {messages.map((msg) => (
              <div key={msg.id || msg.text + msg.sender + Math.random()}>
                <strong>{msg.sender}:</strong> {msg.text}
                {msg.audioUrl && (
                  <audio controls>
                    <source src={msg.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {msg.sender === 'You' && (
                  <div>
                    <button onClick={() => handleEditMessage(msg.id, msg.text)}>Edit</button>
                    <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={async () => {
              if (editMode) {
                handleUpdateMessage();
              } else {
                handleSendMessage();
              }
            }}
          >
            {editMode ? 'Update' : 'Send'}
          </button>

          {/* Record Button */}
          {!input.trim() && !isRecording && (
            <button
              onClick={async () => {
                setIsRecording(true);
                await startRecording();
              }}
              style={{ marginTop: '10px' }}
            >
              Start Recording
            </button>
          )}

          {/* Stop Recording Button */}
          {isRecording && (
            <button
              onClick={async () => {
                await stopRecording(); // Stop the recording if user presses it
                setIsRecording(false);
              }}
              style={{ marginTop: '10px' }}
            >
              Stop Recording
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatRoomback;

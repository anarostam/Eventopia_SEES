// import React, { useEffect, useState } from 'react';
// import { socket } from '../../Socket';
// import { supabase } from '../../Client';
// import { useMessages } from './MessageList';
// import { useChatMessages } from './MessageInput';
// import { useAudioRecorder } from './AudioRecorder';

// function ChatRoomback({ currentUser }) {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [isRecording, setIsRecording] = useState(false); 

//   const {
//     messages,
//     setMessages,
//     input,
//     setInput,
//     editMode,
//     sendMessage,
//     editMessage,
//     updateMessage,
//     deleteMessage
//   } = useChatMessages({ selectedUser, currentUser });

//   const { audioUrl, startRecording, uploadAudio, stopRecording } = useAudioRecorder();
//   const { messages: fetchedMessages } = useMessages({ selectedUser, currentUser });

//   useEffect(() => {
//     if (currentUser) {
//       const name = currentUser.name || currentUser.email;
//       socket.emit('register_user', {
//         userId: currentUser.id,
//         name,
//       });
//       console.log("Registered current user:", currentUser.id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data, error } = await supabase
//         .from('user')
//         .select('id, name, email');

//       if (error) {
//         console.error("Error fetching users:", error.message);
//       } else {
//         setUsers(data);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       setMessages(fetchedMessages); 
//     }
//   }, [selectedUser, fetchedMessages, setMessages]);

//   const handleSendMessage = async () => {
//     if (input.trim()) {
//       sendMessage(); 
//     } else {
      
//       await handleAudioMessage();
//     }
//   };

  
//   const handleAudioMessage = async () => {
//     setIsRecording(true); // Start recording when message is empty
//     await startRecording();

//     setTimeout(async () => {
//       const uploadedUrl = await uploadAudio(); // Upload the audio after recording
//       setIsRecording(false); // Stop recording
//       try{
//         const { data: userData, error: userError } = await supabase
//                 .from('user')
//                 .select('id')
//                 .eq('email', currentUser.email)
//                 .single();
        
//               if (userError) {
//                 console.error("Error fetching user id:", userError.message);
//                 return;
//               }

//           const fromUserId = userData.id;
//       const toUserId = selectedUser.id;
//       if (uploadedUrl) {
//         const newMessage = {
//           sender: 'You',
//           receiver: selectedUser.email,
//           text: '',
//           audioUrl: uploadedUrl,
//         };

//         setMessages((prev) => [...prev, newMessage]);

//         // Save the audio message in the database
//         const { error } = await supabase.from('messages').insert([{
//           from_id: fromUserId,
//             to_id: toUserId,
//           text: '',
//           audio_url: uploadedUrl,
//         }]);

//         if (error) {
//           console.error("Error saving audio message:", error.message);
//         }
//       } else {
//         console.error("Error uploading audio message");
//       }}catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }, 5500); // 5.5 sec to match audio recording duration
//   };

//   const handleSelectUser = (user) => {
//     setSelectedUser(user);
//   };

//   const handleEditMessage = (messageId, messageText) => {
//     editMessage(messageId, messageText);
//   };

//   const handleUpdateMessage = () => {
//     updateMessage();
//   };

//   const handleDeleteMessage = (messageId) => {
//     deleteMessage(messageId);
//   };

//   const otherUsers = users.filter(
//     (u) => u.email.trim().toLowerCase() !== currentUser.email.trim().toLowerCase()
//   );

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Chatroom</h2>

//       <div>
//         <h3>All Users</h3>
//         {otherUsers.length === 0 ? (
//           <p>No other users available to chat.</p>
//         ) : (
//           otherUsers.map((u) => (
//             <button
//               key={u.id}
//               onClick={() => {
//                 setSelectedUser(u);
//                 setMessages([]);
//               }}
//               style={{ display: 'block', marginBottom: '5px' }}
//             >
//               {u.name || u.email}
//             </button>
//           ))
//         )}
//       </div>

//       {selectedUser && (
//         <div style={{ marginTop: '20px' }}>
//           <h4>Chat with {selectedUser.name || selectedUser.email}</h4>

//           <div style={{
//             border: '1px solid #ccc',
//             height: 200,
//             overflowY: 'scroll',
//             padding: 10,
//             marginBottom: 10
//           }}>
//             {messages.map((msg) => (
//               <div key={msg.id || msg.text + msg.sender + Math.random()}>
//                 <strong>{msg.sender}:</strong> {msg.text}
//                 {msg.audioUrl && (
//                   <audio controls>
//                     <source src={msg.audioUrl} type="audio/wav" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 )}
//                 {msg.sender === 'You' && (
//                   <div>
//                     <button onClick={() => handleEditMessage(msg.id, msg.text)}>Edit</button>
//                     <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//           />
//           <button
//             onClick={async () => {
//               if (editMode) {
//                 handleUpdateMessage();
//               } else {
//                 handleSendMessage();
//               }
//             }}
//           >
//             {editMode ? 'Update' : 'Send'}
//           </button>

//           {/* Record Button */}
//           {!input.trim() && !isRecording && (
//             <button
//               onClick={async () => {
//                 setIsRecording(true);
//                 await startRecording();
//               }}
//               style={{ marginTop: '10px' }}
//             >
//               Start Recording
//             </button>
//           )}

//           {/* Stop Recording Button */}
//           {isRecording && (
//             <button
//               onClick={async () => {
//                 await stopRecording(); // Stop the recording if user presses it
//                 setIsRecording(false);
//               }}
//               style={{ marginTop: '10px' }}
//             >
//               Stop Recording
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatRoomback;



import React, { useEffect, useState } from 'react';
import { socket } from '../../Socket';
import { supabase } from '../../Client';
import { useMessages } from './MessageList';
import { useChatMessages } from './MessageInput';
import { useAudioRecorder } from './AudioRecorder';
import EmojiPicker from 'emoji-picker-react';

function ChatRoomback({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    messages,
    setMessages,
    input,
    setInput,
    editMode,
    sendMessage,
    editMessage,
    updateMessage,
    deleteMessage,
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
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('user').select('id, name, email');
      if (!error) setUsers(data);
      else console.error("Error fetching users:", error.message);
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
    setIsRecording(true);
    await startRecording();

    setTimeout(async () => {
      const uploadedUrl = await uploadAudio();
      setIsRecording(false);

      try {
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

          const { error } = await supabase.from('messages').insert([{
            from_id: fromUserId,
            to_id: toUserId,
            text: '',
            audio_url: uploadedUrl,
          }]);

          if (error) console.error("Error saving audio message:", error.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }, 5500);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const handleEditMessage = (id, text) => {
    editMessage(id, text);
  };

  const handleUpdateMessage = () => {
    updateMessage();
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id);
  };

  const otherUsers = users.filter(
    (u) => u.email.trim().toLowerCase() !== currentUser.email.trim().toLowerCase()
  );

  return (
    <div className="chatroom-container">
      {/* Left Sidebar */}
      <div className="user-list">
        <h3 className="sidebar-title">All Users</h3>
        {otherUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          otherUsers.map((user) => (
            <button
              key={user.id}
              className={`user-button ${selectedUser?.id === user.id ? 'active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              {user.name || user.email}
            </button>
          ))
        )}
      </div>

      {/* Right Chat Box */}
      <div className="chat-box">
        {selectedUser ? (
          <>
            <h4>Chat with {selectedUser.name || selectedUser.email}</h4>
            <div className="chat-window">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || `${msg.text}-${index}`}
                  className={`chat-bubble ${msg.sender === 'You' ? 'self' : 'other'}`}
                >
                  <div><strong>{msg.sender}:</strong> {msg.text}</div>

                  {msg.audioUrl && (
                    <audio controls>
                      <source src={msg.audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  {msg.sender === 'You' && (
                    <div className="message-controls">
                      <button onClick={() => handleEditMessage(msg.id, msg.text)}>Edit</button>
                      <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="chat-input-section">
              {/* Emoji Picker */}
              <div className="emoji-picker-container">
                <button className="chat-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  😀
                </button>
                {showEmojiPicker && (
                  <div style={{ position: 'absolute', zIndex: 1000 }}>
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setInput((prev) => prev + emojiData.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Input & Send */}
              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button className="chat-btn" onClick={editMode ? handleUpdateMessage : handleSendMessage}>
                {editMode ? 'Update' : 'Send'}
              </button>

              {/* Record Controls */}
              {!input.trim() && !isRecording && (
                <button className="chat-btn" onClick={startRecording}>🎤 Record</button>
              )}
              {isRecording && (
                <button className="chat-btn" onClick={stopRecording}>⏹ Stop</button>
              )}
            </div>
          </>
        ) : (
          <p>Select a user from the left to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default ChatRoomback;
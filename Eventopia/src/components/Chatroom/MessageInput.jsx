import { useState } from 'react';
import { supabase } from '../../Client';
import { socket } from '../../Socket';
import { useAudioRecorder } from './AudioRecorder';

export function useChatMessages({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { audioUrl, uploadAudio } = useAudioRecorder();

  const sendMessage = async () => {
    if ((!input.trim() && !audioUrl) || !selectedUser) return;

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

      const uploadedAudioUrl = await uploadAudio();

      socket.emit('send_private_message', {
        toUserId: toUserId,
        message: input,
        fromUserId: fromUserId,
        fromName: currentUser.name || currentUser.email,
        audioUrl: uploadedAudioUrl,
      });

      const { error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            from_id: fromUserId,
            to_id: toUserId,
            text: input,
            audio_url: uploadedAudioUrl || null,
          },
        ]);

      if (insertError) {
        console.error("Error saving message:", insertError.message);
      } else {
        console.log("Message saved to Supabase!");
      }

      setMessages((prev) => [...prev, {
        sender: 'You',
        text: input,
        audioUrl: uploadedAudioUrl,
      }]);

      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const editMessage = (messageId, messageText) => {
    setInput(messageText);
    setEditMessageId(messageId);
    setEditMode(true);
  };

  const updateMessage = async () => {
    if (!input.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ text: input })
        .eq('id', editMessageId);

      if (error) {
        console.error("Error updating message:", error.message);
        return;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editMessageId ? { ...msg, text: input } : msg
        )
      );

      setInput('');
      setEditMode(false);
      setEditMessageId(null);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting message:", error.message);
        return;
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    editMode,
    sendMessage,
    editMessage,
    updateMessage,
    deleteMessage,
  };
}

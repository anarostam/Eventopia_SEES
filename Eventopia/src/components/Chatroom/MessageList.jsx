import { useState, useEffect } from 'react';
import { supabase } from '../../Client'; 

export function useMessages({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const fetchMessages = async () => {
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

          // Fetch messages between the two users from Supabase
          const { data, error } = await supabase
            .from('messages')
            .select('id, from_id, to_id, text, audio_url, timestamp')
            .or(`from_id.eq.${fromUserId},to_id.eq.${fromUserId}`)
            .or(`from_id.eq.${toUserId},to_id.eq.${toUserId}`)
            .order('timestamp', { ascending: true });

          if (error) {
            console.error("Error fetching messages:", error.message);
            return;
          }

          // Check if data exists and then format it for the UI
          if (data) {
            setMessages(data.map((msg) => ({
              id: msg.id,
              sender: msg.from_id === fromUserId ? 'You' : selectedUser.name || selectedUser.email,
              text: msg.text,
              audioUrl: msg.audio_url,
            })));
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("❌ Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser, currentUser]); 

  return { messages };
}

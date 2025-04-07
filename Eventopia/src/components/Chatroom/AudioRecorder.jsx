import { useState } from 'react';
import { supabase } from '../../Client';

export function useAudioRecorder() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = () => {
    const constraints = { audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        };

        setMediaRecorder(recorder);
        recorder.start();
        setTimeout(() => recorder.stop(), 5000); // Stop after 5 seconds
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop(); // Stop recording
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return null;

    const fileName = `audio_${Date.now()}.wav`;
    const filePath = `chat-audio/${fileName}`;

    try {
      const { error } = await supabase
        .storage
        .from('chat-audio')
        .upload(filePath, audioBlob, {
          contentType: 'audio/wav',
          upsert: true,
        });

      if (error) {
        console.error("Error uploading audio:", error.message);
        return null;
      }

      const { data } = await supabase
        .storage
        .from('chat-audio')
        .getPublicUrl(filePath);

      console.log("Audio uploaded successfully. URL:", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading audio:", error);
      return null;
    }
  };

  return {
    audioUrl,
    startRecording,
    stopRecording,
    uploadAudio,
  };
}

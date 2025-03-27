import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Chat from "../components/Chatroom/ChatRoomback";
import '../Css-folder/LetsChat.css';


const LetsChat = () => {
  const location = useLocation();
  const currentUser = location.state?.user;
  const [validUser, setValidUser] = useState(null);

  useEffect(() => {
    // In case location.state is lost on refresh, fetch user from localStorage
    if (currentUser) {
      setValidUser(currentUser);
    } else {
      const stored = localStorage.getItem("user");
      const email = localStorage.getItem("email");
      if (stored && email) {
        const userObj = JSON.parse(stored);
        setValidUser({ ...userObj, email });
      }
    }
  }, [currentUser]);

  if (!validUser) {
    return <p className="chat-page">User not found. Please return to the Profile page.</p>;
  }

  return (
    <div className="chat-page">
      <h1 className="chat-title">Let's Chat 💬</h1>
      <Chat currentUser={validUser} />
    </div>
  );
};

export default LetsChat;
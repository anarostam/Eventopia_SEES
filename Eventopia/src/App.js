import React, { use, useEffect, useState } from "react";
import { restoreSession, getCurrentSession, supabase } from "./Client";

import{

} from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const App = () => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const checksession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session ERROR:", error.message);
        setToken(false);
      }else if(session) {
        console.log("Session found:", session);
        setToken(true);
      } else {
        console.log("No session found");
        setToken(false);
      }
    };

    checksession();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setToken(false);
      }; 

  return (  
    <Routes>
      {/* <Route path = "/login" element={<Login setToken={setToken} />} /> */}
      
      {/*Public Routes */}

    </Routes>
  );
};

export default App;
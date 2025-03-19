import React, { useEffect, useState } from "react";
import { restoreSession, getCurrentSession, supabase} from "./Client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import protectedRoute from "./components/protectedRoute";
import {
Signup
} from "./pages";
const App = () => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if(error){
        console.error("Session Error:", error.message);
        setToken(false);
      } else if(session){
        console.log("Session Found:", session);
        setToken(true);
      } else {
        console.log("No session found.");
        setToken(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setToken(false);
  };
  return(
    <Router>
    <Routes>
      <Route path = "/Signup" element={<Signup />} />
      {/*Public Routes*/}
    </Routes>
    </Router>
  );
  };


export default App;
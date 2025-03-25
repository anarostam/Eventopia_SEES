
import React, { useState, useEffect } from 'react';
import './Css-folder/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Footer from './components/Footer';
import AddEvent from './pages/AddEvent';
import EventConfirmation from './pages/EventConfirmation';
import AddVenue from './pages/AddVenue';
import VenueConfirmation from './pages/VenueConfirmation';
import ViewEvent from './pages/ViewEvent';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/eventConfirmation" element={<EventConfirmation />} />
        <Route path="/addVenue" element={<AddVenue />} />
        <Route path="/venueConfirmation" element={<VenueConfirmation />} />
        <Route path="/ViewEvent" element={<ViewEvent />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

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
import Payment from './pages/Payment';
import PaymentConfirmation from './components/payment/PaymentConfirmation';
import ViewVenue from './pages/ViewVenue';
import ManageEvent from './pages/ManageEvent';
import EditEvent from './pages/EditEvent';
import ManageVenue from './pages/ManageVenue';
import EditVenue from './pages/EditVenue';
import MyEvents from './pages/MyEvents';
import Chat from './components/Chatroom/ChatRoomback';
import LetsChat from "./pages/LetsChat";


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
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/viewVenue" element={<ViewVenue />} />
        <Route path="/manageEvent" element={<ManageEvent />} />
        <Route path="/editEvent" element={<EditEvent />} />
        <Route path="/manageVenue" element={<ManageVenue />} />
        <Route path="/editVenue" element={<EditVenue />} />
        <Route path="/myEvents" element={<MyEvents />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/letschat" element={<LetsChat />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

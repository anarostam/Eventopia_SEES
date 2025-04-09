import React, { useState, useEffect } from 'react';
import './Css-folder/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Footer from './components/Footer';
import AddEvent from './pages/Event/AddEvent';
import EventConfirmation from './pages/confirmation/EventConfirmation';
import AddVenue from './pages/Venue/AddVenue';
import VenueConfirmation from './pages/confirmation/VenueConfirmation';
import ViewEvent from './pages/Event/ViewEvent';
import ViewTicket from './pages/Ticket/ViewTicket';
import Payment from './pages/Payment';
import PaymentConfirmation from './components/payment/PaymentConfirmation';
import ViewVenue from './pages/Venue/ViewVenue';
import ManageEvent from './pages/Event/ManageEvent';
import EditEvent from './pages/Event/EditEvent';
import ManageVenue from './pages/Venue/ManageVenue';
import EditVenue from './pages/Venue/EditVenue';
import MyEvents from './pages/Event/MyEvents';
import AddPoll from './pages/poll/AddPoll';
import PollConfirmation from './pages/confirmation/PollConfirmation';
import ViewPoll from './pages/poll/ViewPoll';
import AllPolls from './pages/poll/AllPolls';

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
        <Route path="/ViewTicket" element={<ViewTicket />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/viewVenue" element={<ViewVenue />} />
        <Route path="/manageEvent" element={<ManageEvent />} />
        <Route path="/editEvent" element={<EditEvent />} />
        <Route path="/manageVenue" element={<ManageVenue />} />
        <Route path="/editVenue" element={<EditVenue />} />
        <Route path="/myEvents" element={<MyEvents />} />
        <Route path="/addPoll" element={<AddPoll />} />
        <Route path="/pollConfirmation" element={<PollConfirmation />} />
        <Route path="/viewPoll" element={<ViewPoll />} />
        <Route path="/allPolls" element={<AllPolls />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

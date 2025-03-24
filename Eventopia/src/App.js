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


function App() {
  return (
    
    <Router>
    <Header />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addEvent" element={<AddEvent />} />
      <Route path="/eventConfirmation" element={<EventConfirmation />} />
      <Route path="/addVenue" element={<AddVenue />} />
      <Route path ="/venueConfirmation" element={<VenueConfirmation />} />
    </Routes>
    <Footer />
  </Router>
  );
}

export default App;

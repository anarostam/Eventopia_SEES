import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css';

// Initialize Supabase client
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'your-supabase-key'
);

const MyEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null); // Set userId state
  
  useEffect(() => {
    // Fetch the logged-in user data from Supabase
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !sessionData.user) {
        navigate('/login');
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate('/login');
        return;
      }

      setUser({ ...storedUser, email: sessionData.user.email });
      setUserId(sessionData.user.id); // Set userId from session
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    // If no userId is set, we shouldn't try to fetch events
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    // Fetch events the user is registered for by joining the event_register and event tables
    const fetchUserEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('event_register')
          .select('event_id, event(name, description, date, time, venue, price, picture_url)')
          .eq('attendeeid', userId);

        if (error) throw error;

        const userEvents = data.map((registration) => registration.event);

        setEvents(userEvents);
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [userId]);

  // Handle registration and redirect to payment page
  const handleRegister = (event) => {
    navigate('/payment', {
      state: {
        eventId: event.id,
        attendeeId: userId, // Use the userId from the session
        ticketPrice: event.price || 0,
        eventName: event.name,
      }
    });
  };

  // If user is not logged in or events fail to load, show error
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Your Registered Events</h1>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-12 text-center">No events you are registered for.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={event.picture_url || 'https://via.placeholder.com/300x200'}
                  className="card-img-top"
                  alt={event.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">{event.description}</p>
                  <p className="card-text"><strong>Date:</strong> {event.date}</p>
                  <p className="card-text"><strong>Time:</strong> {event.time}</p>
                  <p className="card-text"><strong>Venue:</strong> {event.venue}</p>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="h5 mb-0">${event.price || 'Free'}</span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRegister(event)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvent;

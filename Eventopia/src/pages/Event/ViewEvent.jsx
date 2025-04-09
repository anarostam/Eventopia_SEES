import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../../Css-folder/ViewEvent.css';

// Initialize Supabase client
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

const ViewEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: eventsData, error: eventError } = await supabase
          .from('event')
          .select('*')
          .order('date', { ascending: true });

        if (eventError) throw eventError;

        // Fetch all venues
        const { data: venuesData, error: venueError } = await supabase
          .from('venues')
          .select('venue_name, capacity');

        if (venueError) throw venueError;

        // Merge capacity into event based on venue name
        const eventsWithCapacity = eventsData.map(event => {
          const matchingVenue = venuesData.find(
            venue => venue.venue_name === event.venue
          );
          return {
            ...event,
            capacity: matchingVenue ? matchingVenue.capacity : 'N/A',
          };
        });

        setEvents(eventsWithCapacity);
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    const userId = localStorage.getItem('userId') || '1'; // Default for testing
    navigate('/payment', {
      state: {
        eventId: event.id,
        attendeeId: parseInt(userId),
        ticketPrice: event.price || 0,
        eventName: event.name,
      }
    });
  };

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
      <h1 className="text-center mb-4">Upcoming Events</h1>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-12 text-center">No events available at the moment.</div>
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
                  <p className="card-text">
                    <strong>Capacity:</strong> {event.registered ?? 0}/{event.capacity}
                  </p>

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

export default ViewEvent;
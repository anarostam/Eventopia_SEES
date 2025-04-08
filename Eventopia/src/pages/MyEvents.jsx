import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import '../Css-folder/ViewEvent.css';

const MyEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user?.email) {
        console.error('Supabase Auth error:', authError?.message);
        setError('Not logged in. Please log in first.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('user')
        .select('id')
        .eq('email', user.email)
        .single();

      if (error || !data) {
        console.error('User table fetch error:', error?.message);
        setError('Could not find user in database.');
        return;
      }

      setUserId(data.id);
    };

    fetchUserId();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserEvents = async () => {
      try {
        // Fetch events this user is registered for
        const { data: registeredEvents, error: regError } = await supabase
          .from('event_register')
          .select('eventid, event(id, name, description, date, time, venue, price, picture_url)')
          .eq('userid', userId);

        if (regError) throw regError;

        const eventsOnly = registeredEvents.map(r => r.event);
        const eventIds = eventsOnly.map(e => e.id);
        const venueNames = [...new Set(eventsOnly.map(e => e.venue))];

        // Fetch venue capacities
        const { data: venues, error: venueError } = await supabase
          .from('venues')
          .select('venue_name, capacity')
          .in('venue_name', venueNames);

        if (venueError) throw venueError;

        // Fetch all registrations to count attendees per event
        const { data: allRegistrations, error: countError } = await supabase
          .from('event_register')
          .select('eventid');

        if (countError) throw countError;

        // Count how many registered per event
        const registrationCounts = eventIds.map(eventId => {
          const count = allRegistrations.filter(r => r.eventid === eventId).length;
          return { eventId, count };
        });

        // Merge capacity and registration count into event
        const eventsWithDetails = eventsOnly.map(event => {
          const venue = venues.find(v => v.venue_name === event.venue);
          const regCount = registrationCounts.find(rc => rc.eventId === event.id)?.count || 0;
          return {
            ...event,
            capacity: venue ? venue.capacity : 'N/A',
            registered: regCount
          };
        });

        setEvents(eventsWithDetails);
      } catch (err) {
        console.error('Event fetch error:', err);
        setError('Could not load your events.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [userId]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
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
                  <p className="card-text">
                    <strong>Registered:</strong> {event.registered} / {event.capacity}
                  </p>
                  <span className="h5 mt-auto">${event.price || 'Free'}</span>
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

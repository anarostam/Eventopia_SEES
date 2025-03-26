import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/ViewEvent.css';

// Initialize Supabase client
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

const ViewVenue = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch event data from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        setEvents(data); // Set the fetched data to state
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      <h1 className="text-center mb-4"> Available Venues</h1>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
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
                  <h5 className="card-title">{event.name} Venue Name</h5>
                  <p className="card-text">{event.capacity} Capacity</p>
                    <p className="card-text"> {event.location} Location </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewVenue;

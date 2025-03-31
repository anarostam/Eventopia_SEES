import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/ViewEvent.css';
import { deleteEvent } from './AddEventBack';
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        setEvents(data); 
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  
  const handleEdit = (event) => {
    navigate('/EditEvent', { state: { event } });
  };

  
  const handleDelete = async (eventId) => {
    const { error } = await supabase
      .from('event')
      .delete()
      .eq('id', eventId);

    if (error) {
      setError('Failed to delete the event. Please try again later.');
    } else {
      
      setEvents(events.filter((event) => event.id !== eventId));
    }
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
      <h1 className="text-center mb-4">Manage Events</h1>

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
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">{event.description}</p>
                  <div className="mt-auto">
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="bi bi-calendar"></i> {event.date}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="bi bi-geo-alt"></i> {event.venue}
                      </small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0">${event.price}</span>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(event)}
                      >
                        Edit Event
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteEvent(event.id)}
                      >
                        Delete Event
                      </button>
                    </div>
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

export default ManageEvent;

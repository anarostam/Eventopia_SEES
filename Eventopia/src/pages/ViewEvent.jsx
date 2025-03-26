import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../Css-folder/ViewEvent.css'; 

const ViewEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event data (replace with actual API endpoint)
  useEffect(() => {
    setLoading(true);
    // TODO: Replace with actual API endpoint
    // Mocking event data for now
    const mockEvents = [
      {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year',
        imageUrl: 'https://via.placeholder.com/150',
        price: 99.99,
        date: '2024-06-15',
        venue: 'Convention Center'
      },
      {
        id: 2,
        title: 'Web Development Workshop',
        description: 'Learn the latest web development technologies',
        imageUrl: 'https://via.placeholder.com/150',
        price: 49.99,
        date: '2024-07-01',
        venue: 'Tech Hub'
      },
      {
        id: 3,
        title: 'AI Summit',
        description: 'Explore the future of Artificial Intelligence',
        imageUrl: 'https://via.placeholder.com/150',
        price: 149.99,
        date: '2024-08-20',
        venue: 'Innovation Center'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegister = (event) => {
    // Get user ID from localStorage or context
    const userId = localStorage.getItem('userId') || '1'; // Default for testing

    // Navigate to payment page with event details
    navigate('/payment', {
      state: {
        eventId: event.id,
        attendeeId: parseInt(userId),
        ticketPrice: event.price
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
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={event.imageUrl} 
                  className="card-img-top" 
                  alt={event.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.title}</h5>
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
                        onClick={() => handleRegister(event)}
                      >
                        Register Now
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

export default ViewEvent;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../Css-folder/ViewTicket.css';

const ViewTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user information from localStorage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      // If no user is logged in, redirect to login page
      navigate('/login');
      return;
    }

    // Mock events data (same as in ViewEvent.jsx)
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

    // Find the selected event based on eventId
    const selectedEvent = mockEvents.find(event => event.id === location.state?.eventId) || mockEvents[0];

    // Create ticket data using the selected event and logged-in user information
    const mockTicket = {
      id: 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      event: {
        id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date,
        venue: selectedEvent.venue,
        time: '09:00 AM - 05:00 PM' // Default time, can be added to mockEvents if needed
      },
      attendee: {
        id: user.id,
        name: user.name || 'User',
        email: user.email
      },
      ticketType: 'General Admission',
      price: location.state?.ticketPrice || selectedEvent.price,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Valid'
    };

    // Simulate API call
    setTimeout(() => {
      setTicket(mockTicket);
      setLoading(false);
    }, 1000);
  }, [location.state, navigate]);

  const handleDownload = () => {
    // In a real application, this would generate a PDF or image file
    alert('Ticket download functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="ticket-container">
        <div className="ticket-header">
          <h2>Your Event Ticket</h2>
          <span className="ticket-id">Ticket ID: {ticket.id}</span>
        </div>

        <div className="ticket-content">
          <div className="ticket-info">
            <h3>{ticket.event.title}</h3>
            <p className="event-description">{ticket.event.description}</p>
            <div className="info-row">
              <span className="label">Date:</span>
              <span className="value">{ticket.event.date}</span>
            </div>
            <div className="info-row">
              <span className="label">Time:</span>
              <span className="value">{ticket.event.time}</span>
            </div>
            <div className="info-row">
              <span className="label">Venue:</span>
              <span className="value">{ticket.event.venue}</span>
            </div>
            <div className="info-row">
              <span className="label">Ticket Type:</span>
              <span className="value">{ticket.ticketType}</span>
            </div>
            <div className="info-row">
              <span className="label">Price:</span>
              <span className="value">${ticket.price}</span>
            </div>
          </div>

          <div className="ticket-qr">
            <QRCodeSVG 
              value={JSON.stringify({
                ticketId: ticket.id,
                eventId: ticket.event.id,
                attendeeId: ticket.attendee.id
              })}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="ticket-footer">
          <div className="attendee-info">
            <h4>Attendee Information</h4>
            <p>Name: {ticket.attendee.name}</p>
            <p>Email: {ticket.attendee.email}</p>
          </div>
          <div className="ticket-actions">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Ticket
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket; 
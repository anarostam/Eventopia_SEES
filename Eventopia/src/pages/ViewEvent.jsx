import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import '../Css-folder/ViewEvent.css'; 
const ViewEvent = () => {
  const [events, setEvents] = useState([]);

  // Fetch event data (replace with actual API endpoint)
  useEffect(() => {
    // Add api
    axios.get('https://api.example.com/events')
      .then(response => {
        setEvents(response.data); 
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">View Events</h1>
      
      {/* display 3 events per row */}
      <div className="row">
        {events.length === 0 ? (
          <div className="col-12 text-center">Loading events...</div>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card">
                <img src={event.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={event.title} />
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">{event.description}</p>
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

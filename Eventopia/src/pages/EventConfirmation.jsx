import React from 'react';
import { Link } from 'react-router-dom';
import '../Css-folder/EventConfirmation.css';

const EventConfirmation = () => {
  return (
    <div className="confirmation-container">
      <h1>Event Added Successfully!</h1>
      <p>Your event has been successfully added to the system.</p>
      
      <div className="btn-group">
        <Link to="/profile">
          <button className="btn btn-primary">Go to Profile</button>
        </Link>
        <Link to="/">
          <button className="btn btn-secondary">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default EventConfirmation;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css-folder/AddEvent.css'; 

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend Logic
    console.log({
      eventName,
      date,
      time,
      location,
      description,
    });
  };

  return (
    <div className="add-event-container">
      <h1>Add Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field-wrapper">
          <label>Event Name:</label>
          <input
            required
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name..."
          />
        </div>

        <div className="form-field-wrapper">
          <label>Date:</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-field-wrapper">
          <label>Time:</label>
          <input
            required
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-field-wrapper">
          <label>Location:</label>
          <input
            required
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
          />
        </div>

        <div className="form-field-wrapper">
          <label>Description:</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description..."
          />
        </div>

        <div className="form-field-wrapper">
          <Link to="/EventConfirmation">
            <button type="submit">Add Event</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;

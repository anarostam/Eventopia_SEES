import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css-folder/AddEvent.css';

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');  // State for venue
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);


  const availableVenues = [
    'Venue 1',
    'Venue 2',
    'Venue 3',
    'Venue 4',
    'Venue 5'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend Logic
    console.log({
      eventName,
      date,
      time,
      venue,
      description,
      picture: picture ? picture.name : '',
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
    }
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

        {/* Venue Selection with Radio Buttons */}
        <div className="form-field-wrapper">
          <label>Venue:</label>
          <div className="radio-group">
            <br />
            {availableVenues.map((venueOption, index) => (
              <div key={index} className="radio-option">
                <input
                  type="radio"
                  id={venueOption}
                  name="venue"
                  value={venueOption}
                  checked={venue === venueOption}
                  onChange={(e) => setVenue(e.target.value)}  // Update venue on change
                />
                <label htmlFor={venueOption}>{venueOption}</label>
              </div>
            ))}
          </div>
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
          <label>Event Picture:</label>
          <input
            type="file"
            onChange={handlePictureChange}
            required
          />
          {picture && <p>Selected Picture: {picture.name}</p>}
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

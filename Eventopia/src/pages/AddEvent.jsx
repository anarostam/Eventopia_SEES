import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/AddEvent.css';
import { AddEventBack } from "./AddEventBack";

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);

  const [price, setPrice] = useState('');
  //const [availableVenues, setAvailableVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

 //const [price, setPrice] = useState(''); // ✅ New state for price

  const navigate = useNavigate();

  const availableVenues = [
    'Venue 1',
    'Venue 2',
    'Venue 3',
    'Venue 4',
    'Venue 5'
  ];
  // const [availableVenues, setAvailableVenues] = useState([
  //   'Venue 1',
  //   'Venue 2',
  //   'Venue 3',
  //   'Venue 4',
  //   'Venue 5'
  // ]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    const result = await AddEventBack({
      eventName,
      date,
      time,
      venue,
      description,
      price: parseFloat(price) || 0,
      picture,
      price: parseFloat(price) || 0, // default to 0 if empty
    });

    if (result.success) {
      alert("Event added successfully!");
      navigate("/EventConfirmation");
    } else {
      alert(`Failed to add event: ${result.message}`);
    }
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
        <div className="form-field-wrapper">
          <label>Price (enter 0 for Free):</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter ticket price..."
            required
          />
        </div>


        {/* ✅ New Price Field */}
        <div className="form-field-wrapper">
          <label>Price (enter 0 for Free):</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter ticket price..."
            required
          />
        </div>

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
                  onChange={(e) => setVenue(e.target.value)}
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
          <button type="submit">Add Event</button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;

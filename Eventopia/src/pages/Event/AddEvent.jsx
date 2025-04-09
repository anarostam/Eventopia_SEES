import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Css-folder/AddEvent.css';
import { AddEventBack} from "../backend/AddEventBack";
import { supabase } from "../../Client";

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');  // State for venue
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);

  const [price, setPrice] = useState('');
  const [availableVenues, setAvailableVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.from('venues').select('id, venue_name, location, capacity, venuepicture');
      if (error) {
        console.error('Error fetching venues:', error.message);
      } else {
        setAvailableVenues(data);
      }
      setLoadingVenues(false);
    };

  const availableVenues = [
    'Venue 1',
    'Venue 2',
    'Venue 3',
    'Venue 4',
    'Venue 5'
  ];

    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = await AddEventBack({
      eventName,
      date,
      time,
      venue,
      description,
      price: parseFloat(price) || 0,
      picture,
    });
  
    if (result.success) {
      alert("Event added successfully!");
      navigate("/EventConfirmation");
      // redirect if needed or clear form
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
          {loadingVenues ? (
            <p>Loading venues...</p>
          ) : (
            <div className="radio-group">
              {availableVenues.map((v) => (
  <div key={v.id} className="radio-option" style={{ marginBottom: '1rem' }}>
    <input
      type="radio"
      id={`venue-${v.id}`}
      name="venue"
      value={v.venue_name}
      checked={venue === v.venue_name}
      onChange={(e) => setVenue(e.target.value)}
    />
    <label htmlFor={`venue-${v.id}`}>
      <strong>{v.venue_name}</strong><br />
      <img
        src={v.venuepicture || 'https://via.placeholder.com/150x100'}
        alt={v.venue_name}
        style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }}
      /><br />
      Location: {v.location}<br />
      Capacity: {v.capacity}
    </label>
  </div>
))}
            </div>
          )}
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
          {/* <Link to="/EventConfirmation">
            <button type="submit">Add Event</button>
          </Link> */}

<button type="submit">Add Event</button>

        </div>
      </form>
    </div>
  );
};

export default AddEvent;

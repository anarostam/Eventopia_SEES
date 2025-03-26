<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/AddEvent.css';
import { AddEventBack} from "./AddEventBack";

import { supabase } from "../Client";

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');  // State for venue
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
<<<<<<< Updated upstream

  // const navigate = useNavigate(); 
  // const availableVenues = [
  //   'Venue 1',
  //   'Venue 2',
  //   'Venue 3',
  //   'Venue 4',
  //   'Venue 5'
  // ];

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Backend Logic
  //   console.log({
  //     eventName,
  //     date,
  //     time,
  //     venue,
  //     description,
  //     picture: picture ? picture.name : '',
  //   });
  // };

  // const availableVenues = [
  //   'Venue 1',
  //   'Venue 2',
  //   'Venue 3',
  //   'Venue 4',
  //   'Venue 5'
  // ];
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

    fetchVenues();
  }, []);
=======
>>>>>>> Stashed changes

  const navigate = useNavigate(); 
  // const availableVenues = [
  //   'Venue 1',
  //   'Venue 2',
  //   'Venue 3',
  //   'Venue 4',
  //   'Venue 5'
  // ];
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

<<<<<<< Updated upstream
  const navigate = useNavigate(); 
  // const availableVenues = [
  //   'Venue 1',
  //   'Venue 2',
  //   'Venue 3',
  //   'Venue 4',
  //   'Venue 5'
  // ];
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

    fetchVenues();
  }, []);

=======
    fetchVenues();
  }, []);

>>>>>>> Stashed changes
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = await AddEventBack({
      eventName,
      date,
      time,
      venue,
      description,
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

        {/* Venue Selection with Radio Buttons */}
        <div className="form-field-wrapper">
          {/* <label>Venue:</label>
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
          </div> */}
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

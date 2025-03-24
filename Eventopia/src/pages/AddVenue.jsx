import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/AddVenue.css'; 

const AddVenue = () => {
  const [venueName, setVenueName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [picture, setPicture] = useState(null); 

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();


    const newVenue = {
      venueName,
      location,
      capacity,
      picture: picture ? picture.name : '',
    };

    console.log('Venue Created:', newVenue);
    
   
    navigate('/venues'); 
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
    }
  };

  return (
    <div className="add-venue-container">
      <h1>Add a Venue</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field-wrapper">
          <label>Venue Name:</label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="Enter venue name..."
            required
          />
        </div>

        <div className="form-field-wrapper">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            required
          />
        </div>

        <div className="form-field-wrapper">
          <label>Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter venue capacity..."
            required
          />
        </div>

        <div className="form-field-wrapper">
          <label>Venue Picture:</label>
          <input
            type="file"
            onChange={handlePictureChange}
            required
          />
          {picture && <p>Selected Picture: {picture.name}</p>}
        </div>

        <div className="form-field-wrapper">
          <button type="submit">Create Venue</button>
        </div>
      </form>
    </div>
  );
};

export default AddVenue;

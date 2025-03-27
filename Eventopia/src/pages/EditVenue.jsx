import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css';
import { updateVenue } from './Venueback';
import { supabase } from '../Client';

const EditVenue = () => {
  const { state } = useLocation();
  const { venue } = state;
  const [formData, setFormData] = useState(venue);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!venue) {
      navigate('/ManageVenue'); 
    }
  }, [venue, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "venuepicture") {
      const file = e.target.files[0]; 
      console.log("Selected file:", file); 
      setFormData((prevData) => ({
        ...prevData,
        venuepicture: file, 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  const result = await updateVenue({
    id: formData.id,
    venueName: formData.venue_name,
    location: formData.location,
    capacity: formData.capacity,
    picture: formData.venuepicture,
  });

  if (!result.success) {
    alert(result.message);
  } else {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      navigate('/ManageVenue');
    }, 3000);
  }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Venue</h1>
      <form onSubmit={handleUpdate}>
        <div className="form-field-wrapper">
          <label>Venue Name</label>
          <input
            type="text"
            className="form-control"
            name="venue_name"
            value={formData.venue_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field-wrapper">
          <label>Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field-wrapper">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field-wrapper">
          <label>Venue Picture</label>
          <input type="file" className="form-control" name="venuepicture" onChange={handleChange} accept="image/*" />
          {formData.venuepicture && typeof formData.venuepicture === 'string' && (
            <img src={formData.venuepicture} alt="Venue" className="event-preview" />
          )}
        </div>
        <div className="form-field-wrapper">
          <button type="submit" className="btn btn-primary">
            Update Venue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVenue;

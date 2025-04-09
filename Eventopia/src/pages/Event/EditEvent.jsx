import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../../Css-folder/ViewEvent.css';
import { updateEvent } from '../backend/AddEventBack'; 

const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'your-supabase-key'
);

const EditEvent = () => {
  const { state } = useLocation();
  const { event } = state;
  const [formData, setFormData] = useState(event);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!event) {
      navigate('/ManageEvent');
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, picture_url: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Convert price to float if not empty
    if (formData.price && isNaN(parseFloat(formData.price))) {
      alert("Please enter a valid price.");
      return;
    }

    const result = await updateEvent({
      ...formData,
      price: parseFloat(formData.price) || 0, // Default to 0 if empty or invalid
    });

    if (!result.success) {
      alert(result.message);
    } else {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate('/ManageEvent');
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Event</h1>
      {showConfirmation && (
        <div className="alert alert-success" role="alert">
          Event updated successfully!
        </div>
      )}
      <form onSubmit={handleUpdate}>
        <div className="form-field-wrapper">
          <label>Event Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-field-wrapper">
          <label>Description</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-field-wrapper">
          <label>Date</label>
          <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-field-wrapper">
          <label>Time</label>
          <input type="time" className="form-control" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div className="form-field-wrapper">
          <label>Venue</label>
          <input type="text" className="form-control" name="venue" value={formData.venue} onChange={handleChange} required />
        </div>
        
        {/* ✅ Price Field */}
        <div className="form-field-wrapper">
          <label>Price (enter 0 for Free):</label>
          <input
            type="number"
            className="form-control"
            name="price"
            min="0"
            value={formData.price || 0}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field-wrapper">
          <label>Event Picture</label>
          <input type="file" className="form-control" name="picture_url" onChange={handleChange} accept="image/*" />
          {formData.picture_url && typeof formData.picture_url === 'string' && (
            <img src={formData.picture_url} alt="Event" className="event-preview" />
          )}
        </div>
        <div className="form-field-wrapper">
          <button type="submit" className="btn btn-primary">Update Event</button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;

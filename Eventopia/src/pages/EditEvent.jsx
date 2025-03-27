import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css';
import { updateEvent, deleteEvent } from './AddEventBack';
// Initialize Supabase client
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'your-supabase-key'
);

const EditEvent = () => {
  const { state } = useLocation();
  const { event } = state;
  const [formData, setFormData] = useState(event);
  const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation popup
  const navigate = useNavigate();

  useEffect(() => {
    if (!event) {
      navigate('/ManageEvent'); // Redirect if no event to edit
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('event')
      .update(formData)
      .eq('id', formData.id);

    if (error) {
      alert('Error updating event');
    } else {
      setShowConfirmation(true); // Show confirmation message
      setTimeout(() => {
        setShowConfirmation(false); // Hide the confirmation message after 3 seconds
        navigate('/ManageEvent'); // Redirect to the manage event page after update
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Edit Event</h1>
      
      {/* Confirmation message */}
      {showConfirmation && (
        <div className="alert alert-success" role="alert">
          Event updated successfully!
        </div>
      )}

      <form onSubmit={updateEvent}>
        <div className="form-field-wrapper">
          <label>Event Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field-wrapper">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {/* <div className="form-field-wrapper">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="form-field-wrapper">
          <button type="submit" className="btn btn-primary">
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;

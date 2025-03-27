import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css';

// Initialize Supabase client
const supabase = createClient(
    'https://fkbflmyfughlgxnzuazy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
  );

const EditVenue = () => {
  const { state } = useLocation();
  const { venue } = state;
  const [formData, setFormData] = useState(venue);
  const navigate = useNavigate();

  useEffect(() => {
    if (!venue) {
      navigate('/ManageVenue'); // Redirect if no venue to edit
    }
  }, [venue, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('venues')
      .update(formData)
      .eq('id', formData.id);

    if (error) {
      alert('Error updating venue');
    } else {
      alert('Venue updated successfully');
      navigate('/ManageVenue');
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
          <button type="submit" className="btn btn-primary">
            Update Venue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVenue;

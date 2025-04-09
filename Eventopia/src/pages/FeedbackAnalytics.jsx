import React, { useState, useEffect } from 'react';
import { supabase } from '../Client';
import '../Css-folder/FeedbackAnalytics.css';

const FeedbackAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(null); // stores the average rating of an event as set by users who reviewed it
  const [comments, setComments] = useState([]);  // stores an array of user comments made about an event

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      
      // First, check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('event')
        .select('count');

      if (testError) {
        console.error('Database connection test error:', testError);
        throw new Error('Failed to connect to database');
      }

      console.log('Database connection successful');

      // Now fetch the actual events with correct column names
      const { data, error } = await supabase
        .from('event')
        .select(`
          id,
          name,
          date,
          time,
          venue,
          description,
          price,
          picture_url,
          created_at
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Event fetch error:', error);
        throw error;
      }

      console.log('Events fetched:', data);

      if (!data || data.length === 0) {
        console.log('No events found in database');
      }

      setEvents(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchEvents:', err);
      setError(err.message || 'Failed to load events');
      setLoading(false);
    }
  };

  const handleEventChange = (eventId) => {
    console.log('Selected event ID:', eventId);
    const event = events.find(e => e.id === parseInt(eventId));
    console.log('Found event:', event);
    setSelectedEvent(event);
  };

  // load average score for the selected event, load each time a new event is selected

  useEffect(() => {
    const computeAverageRating = async() => {
      if (!selectedEvent) {
        setAverageRating(null);
        setComments([]);
        console.log("No selected event.");
        return;  // if no event is selected, set rating to null and exit the method
      }

      console.log("Selected event ID for calculation: ", selectedEvent?.id);

      const { data, error } = await supabase
        .from("feedback")
        .select("rating, comment, user_email")
        .eq("event_id", selectedEvent?.id);  // get all the matching ratings & comments with the user's email for the selected event by matching ids

      if (error) {
        console.error("Error getting ratings from database: ", error);
        setAverageRating(null);
        setComments([]);
        return;
      }

      if (data.length === 0) {
        setAverageRating("No Ratings Yet");
        setComments([]);
        return;
      }

      const total = data.reduce((sum, entry) => sum + entry.rating, 0);
      const avg = total / data.length;  // get the average rating of the sum of all ratings stored in the database

      setAverageRating(avg.toFixed(2)); // round to 2 d.p.
      setComments(data.filter(entry => entry.comment && entry.comment.trim() != ""));
    };

    computeAverageRating();
  }, [selectedEvent])

  if (loading) {
    return (
      <div className="feedback-analytics-container">
        <div className="loading-spinner">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-analytics-container">
        <div className="error-message">
          <h3>Error Loading Events</h3>
          <p>{error}</p>
          <button 
            onClick={fetchEvents}
            className="retry-button"
          >
            Retry Loading Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-analytics-container">
      <h1>Feedback Analytics</h1>
      
      <div className="event-selector">
        <label htmlFor="event-select">Select an Event:</label>
        <select 
          id="event-select"
          onChange={(e) => handleEventChange(e.target.value)}
          value={selectedEvent?.id || ''}
        >
          <option value="">Choose an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="event-details">
          <h2>{selectedEvent.name}</h2>
          <div className="event-info">
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Price:</strong> ${selectedEvent.price || 'Free'}</p>
            <p><strong>Created:</strong> {new Date(selectedEvent.created_at).toLocaleDateString()}</p>
          </div>
          
          <div className="feedback-stats">
            <h3>Feedback Statistics</h3>
            {averageRating === null ? (
              <p>Loading feedback data...</p>
            ) : (
              <p><strong>Event Rating:</strong> {averageRating} / 5</p>
            )}

            {comments.length > 0 ? (
              <div className="comments-section">
                <p><strong>Comments:</strong></p>
                <ul>
                  {comments.map((entry, index) => (
                    <li key={index} className="comment-entry">
                      <p><strong>{entry.user_email}</strong>: {entry.comment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No comments available for this event.</p>
            )}
          </div>
        </div>
      )}

      {!selectedEvent && events.length > 0 && (
        <div className="no-selection">
          <p>Please select an event to view its feedback analytics.</p>
        </div>
      )}

      {events.length === 0 && (
        <div className="no-events">
          <p>No events found in the database.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackAnalytics; 
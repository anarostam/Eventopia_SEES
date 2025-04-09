import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import Chart from 'chart.js/auto';
import '../Css-folder/FeedbackAnalytics.css';

const FeedbackAnalytics = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserRole();
    fetchEvents();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', user.email)
        .single();

      if (profileError) throw profileError;

      // Role 4 is stakeholder
      if (profile.role !== 4) {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/login');
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      setError('Error fetching events');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackForEvent = async (eventId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('rating, created_at')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process feedback data
      const ratingCounts = Array(5).fill(0);
      data.forEach(feedback => {
        ratingCounts[feedback.rating - 1]++;
      });

      setFeedbackData({
        raw: data,
        summary: {
          totalResponses: data.length,
          averageRating: data.length > 0 
            ? (data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1)
            : 0,
          responseRate: data.length // You might want to compare this against total attendees
        },
        distribution: ratingCounts
      });

      updateChart(ratingCounts);
    } catch (error) {
      setError('Error fetching feedback data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChart = (ratingCounts) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
          label: 'Number of Ratings',
          data: ratingCounts,
          backgroundColor: [
            '#ff6b6b',
            '#ffd93d',
            '#6c5ce7',
            '#a8e6cf',
            '#00b894'
          ],
          borderColor: [
            '#ff5252',
            '#ffd700',
            '#6c5ce7',
            '#a8e6cf',
            '#00b894'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Rating Distribution'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  };

  const handleEventChange = (event) => {
    const eventId = event.target.value;
    setSelectedEvent(eventId);
    if (eventId) {
      fetchFeedbackForEvent(eventId);
    } else {
      setFeedbackData(null);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  };

  if (loading) {
    return (
      <div className="feedback-analytics-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-analytics-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="feedback-analytics-container">
      <h2>Feedback Analytics Dashboard</h2>
      
      <div className="event-selector">
        <select 
          value={selectedEvent || ''} 
          onChange={handleEventChange}
          className="event-select"
        >
          <option value="">Select an Event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {feedbackData && (
        <div className="analytics-content">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Responses</h3>
              <p>{feedbackData.summary.totalResponses}</p>
            </div>
            <div className="summary-card">
              <h3>Average Rating</h3>
              <p>{feedbackData.summary.averageRating} / 5.0</p>
            </div>
            <div className="summary-card">
              <h3>Response Rate</h3>
              <p>{feedbackData.summary.responseRate} responses</p>
            </div>
          </div>

          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAnalytics; 

// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import '../Css-folder/ViewEvent.css'; 

// const supabase = createClient(
//   'https://fkbflmyfughlgxnzuazy.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
// );

// const ViewEvent = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const { data, error } = await supabase
//         .from('event')
//         .select('*')
//         .order('date', { ascending: true });

//       if (error) {
//         console.error('Error fetching events:', error.message);
//       } else {
//         setEvents(data);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center mb-4">View Events</h1>
      
//       <div className="row">
//         {events.length === 0 ? (
//           <div className="col-12 text-center">Loading events...
//           <br />
//           <br />
//           <br/>
//           <br />
//           <br />
//           </div>
//         ) : (
//           events.map((event) => (
//             <div key={event.id} className="col-md-4 mb-4">
//               <div className="card h-100">
//                 <img
//                   src={event.picture_url || 'https://via.placeholder.com/300x200'}
//                   className="card-img-top"
//                   alt={event.name}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{event.name}</h5>
//                   <p className="card-text"><strong>Date:</strong> {event.date}</p>
//                   <p className="card-text"><strong>Time:</strong> {event.time}</p>
//                   <p className="card-text"><strong>Venue:</strong> {event.venue}</p>
//                   <p className="card-text">{event.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewEvent;





////////////////////////////
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css';

const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

const ViewEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    const userId = localStorage.getItem('userId') || '1'; // default for testing

    navigate('/payment', {
      state: {
        eventId: event.id,
        attendeeId: parseInt(userId),
        ticketPrice: event.price || 0,
        eventName: event.name,
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Upcoming Events</h1>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-12 text-center">No events available at the moment.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={event.picture_url || 'https://via.placeholder.com/300x200'}
                  className="card-img-top"
                  alt={event.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text">{event.description}</p>
                  <p className="card-text"><strong>Date:</strong> {event.date}</p>
                  <p className="card-text"><strong>Time:</strong> {event.time}</p>
                  <p className="card-text"><strong>Venue:</strong> {event.venue}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="h5 mb-0">
                      ${event.price || 'Free'}
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRegister(event)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewEvent;

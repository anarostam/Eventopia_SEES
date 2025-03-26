// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; 
// import '../Css-folder/ViewEvent.css'; 
// const ViewEvent = () => {
//   const [events, setEvents] = useState([]);

//   // Fetch event data (replace with actual API endpoint)
//   useEffect(() => {
//     // Add api
//     axios.get('https://api.example.com/events')
//       .then(response => {
//         setEvents(response.data); 
//       })
//       .catch(error => {
//         console.error('Error fetching events:', error);
//       });
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center mb-4">View Events</h1>
      
//       {/* display 3 events per row */}
//       <div className="row">
//         {events.length === 0 ? (
//           <div className="col-12 text-center">Loading events...</div>
//         ) : (
//           events.map((event, index) => (
//             <div key={event.id} className="col-md-4 mb-4">
//               <div className="card">
//                 <img src={event.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={event.title} />
//                 <div className="card-body">
//                   <h5 className="card-title">{event.title}</h5>
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




import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../Css-folder/ViewEvent.css'; 

const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

const ViewEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">View Events</h1>
      
      <div className="row">
        {events.length === 0 ? (
          <div className="col-12 text-center">Loading events...</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={event.picture_url || 'https://via.placeholder.com/300x200'}
                  className="card-img-top"
                  alt={event.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{event.name}</h5>
                  <p className="card-text"><strong>Date:</strong> {event.date}</p>
                  <p className="card-text"><strong>Time:</strong> {event.time}</p>
                  <p className="card-text"><strong>Venue:</strong> {event.venue}</p>
                  <p className="card-text">{event.description}</p>
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

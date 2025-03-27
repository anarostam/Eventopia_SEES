
// // ✅ FRONTEND COMPONENT - ViewTicket.jsx
// import React, { useEffect, useState } from "react";
// import { fetchUserPayments } from "./TicketBack";
// import "../Css-folder/index.css"; 
// //import "../Css-folder/ViewTicket.css";

// const ViewTicket = ({ userId }) => {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     const getPayments = async () => {
//       const data = await fetchUserPayments(userId);
//       setPayments(data);
//     };

//     if (userId) getPayments();
//   }, [userId]);

//   if (!payments.length) return <p>No payments found.</p>;

//   return (
//     <div className="ticket-container">
//       <h2>My Payments / Tickets</h2>
//       {payments.map((payment) => {
//         const event = payment.event;
//         const attendee = payment.attendee;
//         return (
//           <div key={payment.id} className="ticket-card">
//             <h3>{event.name}</h3>
//             <p><strong>Paid By:</strong> {attendee?.name}</p>
//             <p><strong>Email:</strong> {attendee?.email}</p>
//             <p><strong>Amount:</strong> ${payment.amount}</p>
//             <p><strong>Status:</strong> {payment.status}</p>
//             <p><strong>Date:</strong> {event.date}</p>
//             <p><strong>Time:</strong> {event.time}</p>
//             <p><strong>Venue:</strong> {event.venue}</p>
//             <p><strong>Payment Time:</strong> {new Date(payment.created_at).toLocaleString()}</p>
//             {event.picture_url && (
//               <img
//                 src={event.picture_url}
//                 alt="Event"
//                 className="ticket-event-image"
//               />
//             )}
//             <p>{event.description}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ViewTicket;

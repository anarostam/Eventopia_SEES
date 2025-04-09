import React from 'react';
import { useLocation } from 'react-router-dom';
import PaymentForm from '../components/payment/PaymentForm';

const Payment = () => {
  const location = useLocation();
  const { eventId, attendeeId, ticketPrice } = location.state || {};

  if (!eventId || !attendeeId || !ticketPrice) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Invalid payment information. Please try again from the event page.
        </div>
      </div>
    );
  } 

  return (
    <div>
      <PaymentForm
        eventId={eventId}
        attendeeId={attendeeId}
        ticketPrice={ticketPrice}
      />
    </div>
  );
};

export default Payment; 
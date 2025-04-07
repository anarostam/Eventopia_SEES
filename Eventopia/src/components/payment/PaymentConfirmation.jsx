import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state || {};

  useEffect(() => {
    // Save ticket data to localStorage (optional)
    const ticketData = {
      name: "Khujista",
      eventName: paymentDetails.eventName,
      eventTime: paymentDetails.eventTime
    };
    localStorage.setItem('ticket', JSON.stringify(ticketData));
  }, [paymentDetails]);



  const handleViewTicket = () => {

    navigate('/view-tickets', {
      state: {
        paymentId: paymentDetails.paymentId,
        ticketId: paymentDetails.ticketId,
        eventId: paymentDetails.eventId,
        attendeeId: paymentDetails.attendeeId,
        amount: paymentDetails.amount,
        type: paymentDetails.type
      }
    });


  const handleBackToEvents = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: '3rem' }}></i>
              <h2>Payment Successful!</h2>
              <p><strong>Payment ID:</strong> {paymentDetails.paymentId}</p>
              <p><strong>Amount Paid:</strong> ${paymentDetails.amount}</p>
              <p><strong>Status:</strong> <span className="badge bg-success">Completed</span></p>

              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-primary" onClick={handleViewTicket}>View Ticket</button>
                <button className="btn btn-outline-primary" onClick={handleBackToEvents}>Back to Events</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;

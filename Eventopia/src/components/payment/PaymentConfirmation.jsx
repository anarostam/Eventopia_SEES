import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state || {};

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
  };

  const handleBackToEvents = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="card-title mb-4">Payment Successful!</h2>
              <div className="payment-details mb-4">
                <p className="mb-2">
                  <strong>Payment ID:</strong> {paymentDetails.paymentId}
                </p>
                <p className="mb-2">
                  <strong>Amount Paid:</strong> ${paymentDetails.amount}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{' '}
                  <span className="badge bg-success">Completed</span>
                </p>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleViewTicket}
                >
                  View Ticket
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleBackToEvents}
                >
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;

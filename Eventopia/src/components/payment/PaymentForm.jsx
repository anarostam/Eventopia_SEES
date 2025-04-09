import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentManager from '../../services/PaymentManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerForEvent } from '../../pages/backend/EventRegistration';
import { supabase } from '../../Client';

const PaymentForm = ({ eventId, attendeeId, ticketPrice }) => {
  const navigate = useNavigate();
  const paymentManager = PaymentManager.getInstance();

  const [paymentData, setPaymentData] = useState({
    amount: ticketPrice || 0,
    status: paymentManager.PAYMENT_STATUSES.PENDING,
    eventId: parseInt(eventId) || 0,
    attendeeId: 0,
    type: paymentManager.PAYMENT_TYPES.REGULAR
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('payment'); // payment, processing, complete

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const { data: userData, error: userError } = await supabase  // query user table to get the logged in user's id
      .from('user')
      .select('*')
      .eq('email', storedUser.email)
      .single();

    if (userError || !userData) {
      console.error("Could not fetch user from users table:", userError);
      return;
    }

    setPaymentData(prev => ({
      ...prev,
      attendeeId: userData.id,
    }));  // set the attendee ID to the logged in user's id instead of the default value which was previously forced, 1

    console.log("Attendee ID", attendeeId);
    console.log("User ID: ", userData.id);

    // Validate payment data
    const validation = paymentManager.validatePaymentData(paymentData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      setStep('processing');
      // Process payment through singleton manager
      const result = await paymentManager.processPayment(paymentData);
      
      // Check registration status
      const registrationStatus = paymentManager.getRegistrationStatus(result.registrationId);
      if (registrationStatus !== paymentManager.REGISTRATION_STATUSES.CONFIRMED) {
        throw new Error('Registration failed to confirm');
      }

      // Register for the event after payment is successful
      const registrationResult = await registerForEvent(userData.id, eventId);
      if (!registrationResult.success) {
        throw new Error(registrationResult.message || 'Event registration failed.');
      }
      // Get ticket details
      const ticketDetails = paymentManager.getTicketDetails(result.ticketId);
      if (!ticketDetails) {
        throw new Error('Failed to generate ticket');
      }

      setStep('complete');
      
      // Navigate to confirmation page with all details
      navigate('/payment-confirmation', { 
        state: {
          ...result,
          ticket: ticketDetails
        }
      });
    } catch (error) {
      setError(error.message || 'Payment processing failed. Please try again.');
      console.error('Payment error:', error);
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const renderProcessingStep = () => (
    <div className="text-center p-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Processing payment...</span>
      </div>
      <h4>Processing Your Payment</h4>
      <p className="text-muted">Please do not close this window...</p>
    </div>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount ($)</label>
        <input
          type="number"
          className="form-control"
          id="amount"
          name="amount"
          value={paymentData.amount}
          onChange={handleInputChange}
          required
          disabled
        />
      </div>

      <div className="mb-3">
        <label htmlFor="paymentType" className="form-label">Payment Type</label>
        <select
          className="form-select"
          id="paymentType"
          name="type"
          value={paymentData.type}
          onChange={handleInputChange}
          required
        >
          <option value={paymentManager.PAYMENT_TYPES.REGULAR}>Regular Payment</option>
          <option value={paymentManager.PAYMENT_TYPES.SPONSORSHIP}>Sponsorship</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="cardNumber" className="form-label">Card Number</label>
        <input
          type="text"
          className="form-control"
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          pattern="[0-9\s]{13,19}"
          maxLength="19"
          required
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input
            type="text"
            className="form-control"
            id="expiryDate"
            placeholder="MM/YY"
            pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
            maxLength="5"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="cvv" className="form-label">CVV</label>
          <input
            type="text"
            className="form-control"
            id="cvv"
            placeholder="123"
            pattern="[0-9]{3,4}"
            maxLength="4"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? (
          <span>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Payment Details</h3>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {step === 'processing' ? renderProcessingStep() : renderPaymentForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 

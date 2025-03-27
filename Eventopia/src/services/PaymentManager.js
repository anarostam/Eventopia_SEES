class PaymentManager {
  constructor() {
    if (PaymentManager.instance) {
      return PaymentManager.instance;
    }
    PaymentManager.instance = this;
    
    // Initialize payment states
    this.PAYMENT_STATUSES = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      REFUNDED: 'refunded'
    };

    this.PAYMENT_TYPES = {
      REGULAR: 'regular',
      SPONSORSHIP: 'sponsorship'
    };

    this.REGISTRATION_STATUSES = {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      CANCELLED: 'cancelled'
    };

    // Track active transactions to prevent duplicates
    this.activeTransactions = new Set();
    // Track registrations
    this.registrations = new Map();
    // Track tickets
    this.tickets = new Map();
  }

  // Ensure singleton instance
  static getInstance() {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  // Process a new payment
  async processPayment(paymentData) {
    const transactionId = `${paymentData.eventId}-${paymentData.attendeeId}-${Date.now()}`;
    
    // Check for duplicate transactions
    if (this.activeTransactions.has(transactionId)) {
      throw new Error('Duplicate transaction detected');
    }

    try {
      // Add to active transactions
      this.activeTransactions.add(transactionId);

      // Create registration first
      const registrationId = await this.createRegistration(paymentData);

      // Update payment status
      paymentData.status = this.PAYMENT_STATUSES.PROCESSING;

      // TODO: Backend integration will handle actual payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update payment status on success
      paymentData.status = this.PAYMENT_STATUSES.COMPLETED;

      // Generate ticket after successful payment
      const ticketId = await this.generateTicket(paymentData, registrationId);
      
      // Update registration status
      await this.updateRegistrationStatus(registrationId, this.REGISTRATION_STATUSES.CONFIRMED);
      
      return {
        paymentId: transactionId,
        registrationId,
        ticketId,
        ...paymentData,
      };
    } catch (error) {
      paymentData.status = this.PAYMENT_STATUSES.FAILED;
      throw error;
    } finally {
      // Remove from active transactions
      this.activeTransactions.delete(transactionId);
    }
  }

  async createRegistration(paymentData) {
    const registrationId = `REG-${Date.now()}`;
    this.registrations.set(registrationId, {
      id: registrationId,
      eventId: paymentData.eventId,
      attendeeId: paymentData.attendeeId,
      status: this.REGISTRATION_STATUSES.PENDING,
      type: paymentData.type // Regular or Sponsorship
    });
    return registrationId;
  }

  async updateRegistrationStatus(registrationId, status) {
    const registration = this.registrations.get(registrationId);
    if (registration) {
      registration.status = status;
      this.registrations.set(registrationId, registration);
    }
  }

  async generateTicket(paymentData, registrationId) {
    const ticketId = `TKT-${Date.now()}`;
    this.tickets.set(ticketId, {
      id: ticketId,
      registrationId,
      eventId: paymentData.eventId,
      attendeeId: paymentData.attendeeId,
      price: paymentData.amount,
      purchaseDate: new Date().toISOString(),
      type: paymentData.type // Regular or Sponsorship
    });
    return ticketId;
  }

  // Process a refund
  async processRefund(paymentId) {
    if (this.activeTransactions.has(paymentId)) {
      throw new Error('Payment is currently being processed');
    }

    try {
      this.activeTransactions.add(paymentId);
      
      // TODO: Backend integration will handle actual refund processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update associated registration and ticket
      const registration = Array.from(this.registrations.values())
        .find(reg => reg.paymentId === paymentId);
      
      if (registration) {
        await this.updateRegistrationStatus(registration.id, this.REGISTRATION_STATUSES.CANCELLED);
      }

      return {
        status: this.PAYMENT_STATUSES.REFUNDED,
        refundId: `REF-${paymentId}`,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.activeTransactions.delete(paymentId);
    }
  }

  // Apply discount to payment
  applyDiscount(amount, discountType, discountValue) {
    if (discountType === 'percentage') {
      return amount * (1 - discountValue / 100);
    } else if (discountType === 'fixed') {
      return Math.max(0, amount - discountValue);
    }
    return amount;
  }

  // Validate payment data
  validatePaymentData(paymentData) {
    const errors = [];
    
    if (!Number.isInteger(paymentData.eventId)) {
      errors.push('Invalid event ID');
    }
    
    if (!Number.isInteger(paymentData.attendeeId)) {
      errors.push('Invalid attendee ID');
    }
    
    if (typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
      errors.push('Invalid payment amount');
    }

    if (!Object.values(this.PAYMENT_TYPES).includes(paymentData.type)) {
      errors.push('Invalid payment type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get registration status
  getRegistrationStatus(registrationId) {
    const registration = this.registrations.get(registrationId);
    return registration ? registration.status : null;
  }

  // Get ticket details
  getTicketDetails(ticketId) {
    return this.tickets.get(ticketId);
  }
}

export default PaymentManager; 
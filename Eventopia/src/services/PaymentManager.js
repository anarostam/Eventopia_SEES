import { supabase } from "../Client";

class PaymentManager {
  constructor() {
    if (PaymentManager.instance) {
      return PaymentManager.instance;
    }
    PaymentManager.instance = this;

    this.PAYMENT_STATUSES = {
      PENDING: "pending",
      PROCESSING: "processing",
      COMPLETED: "completed",
      FAILED: "failed",
      REFUNDED: "refunded",
    };

    this.PAYMENT_TYPES = {
      REGULAR: "regular",
      SPONSORSHIP: "sponsorship",
    };

    this.REGISTRATION_STATUSES = {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      CANCELLED: "cancelled",
    };

    this.activeTransactions = new Set();
    this.registrations = new Map();
    this.tickets = new Map();
  }

  static getInstance() {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  // async logPayment(eventId, attendeeId, amount, status) {

  async logPayment(eventId, attendeeId, amount, status) {

    try {
      const { data, error } = await supabase
      .from('payments')
      .insert([{
        eventID: eventId,
        attendeeID: attendeeId,
        amount: amount,
        status: status
      }])
      .select(); // return newly created row
  
      console.log("Supabase insert response: ", data, error);

      if (error) {
        console.error("Error logging payment to Supabase:", error);
        return { data: null, error };
      }

      console.log("✅ Supabase insert success:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error logging payment:", error);
      return { data: null, error };
    }
  }

  async processPayment(paymentData) {
    const transactionKey = `${paymentData.eventId}-${paymentData.attendeeId}-${Date.now()}`;

    if (this.activeTransactions.has(transactionKey)) {
      throw new Error("Duplicate transaction detected");
    }

    try {
      this.activeTransactions.add(transactionKey);

      // 1. Create registration
      const registrationId = await this.createRegistration(paymentData);
      paymentData.status = this.PAYMENT_STATUSES.PROCESSING;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      paymentData.status = this.PAYMENT_STATUSES.COMPLETED;

      // 2. Generate ticket
      const ticketId = await this.generateTicket(paymentData, registrationId);
           
      // log payment
      //this.logPayment(paymentData.eventId, paymentData.attendeeId, paymentData.amount, true);
      //await this.logPayment(paymentData.eventId, paymentData.attendeeId, paymentData.amount, true, transactionId);


      // 3. Log payment to Supabase and grab real payment ID
      const { data: paymentRow, error } = await this.logPayment(
        paymentData.eventId,
        paymentData.attendeeId,
        paymentData.amount,
        true
      );

      console.log("Payment ID: ", paymentRow[0].id);
      console.log("Payment: ", paymentRow);

      if (error || !paymentRow[0].id) {
        console.log("Cannot read properties of null (reading 'paymentRow.id')")
        console.log("Logging error: ", error);
        throw new Error("Payment logging failed.");
      }

      // 4. Update registration status
      await this.updateRegistrationStatus(
        registrationId,
        this.REGISTRATION_STATUSES.CONFIRMED
      );

      // 5. Return values for confirmation/ticket page
      return {
        paymentId: paymentRow[0].id, // ✅ using Supabase-generated ID
        registrationId,
        ticketId,
        ...paymentData,
      };
    } catch (error) {
      paymentData.status = this.PAYMENT_STATUSES.FAILED;
      throw error;
    } finally {
      this.activeTransactions.delete(transactionKey);
    }
  }

  async createRegistration(paymentData) {
    const registrationId = `REG-${Date.now()}`;
    this.registrations.set(registrationId, {
      id: registrationId,
      eventId: paymentData.eventId,
      attendeeId: paymentData.attendeeId,
      status: this.REGISTRATION_STATUSES.PENDING,
      type: paymentData.type,
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
      type: paymentData.type,
    });
    return ticketId;
  }

  async processRefund(paymentId) {
    if (this.activeTransactions.has(paymentId)) {
      throw new Error("Payment is currently being processed");
    }

    try {
      this.activeTransactions.add(paymentId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const registration = Array.from(this.registrations.values()).find(
        (reg) => reg.paymentId === paymentId
      );

      if (registration) {
        await this.updateRegistrationStatus(
          registration.id,
          this.REGISTRATION_STATUSES.CANCELLED
        );
      }

      return {
        status: this.PAYMENT_STATUSES.REFUNDED,
        refundId: `REF-${paymentId}`,
        timestamp: new Date().toISOString(),
      };
    } finally {
      this.activeTransactions.delete(paymentId);
    }
  }

  applyDiscount(amount, discountType, discountValue) {
    if (discountType === "percentage") {
      return amount * (1 - discountValue / 100);
    } else if (discountType === "fixed") {
      return Math.max(0, amount - discountValue);
    }
    return amount;
  }

  validatePaymentData(paymentData) {
    const errors = [];

    if (!Number.isInteger(paymentData.eventId)) {
      errors.push("Invalid event ID");
    }

    if (!Number.isInteger(paymentData.attendeeId)) {
      errors.push("Invalid attendee ID");
    }

    if (typeof paymentData.amount !== "number" || paymentData.amount <= 0) {
      errors.push("Invalid payment amount");
    }

    if (!Object.values(this.PAYMENT_TYPES).includes(paymentData.type)) {
      errors.push("Invalid payment type");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getRegistrationStatus(registrationId) {
    const registration = this.registrations.get(registrationId);
    return registration ? registration.status : null;
  }

  getTicketDetails(ticketId) {
    return this.tickets.get(ticketId);
  }
}

export default PaymentManager;

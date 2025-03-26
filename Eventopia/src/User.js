class User {
    constructor(userId, email, role) {
      this.userId = userId;
      this.email = email;
      this.role = role;
    }
    
    update(eventData) {
        console.log(`📩 Sending email to ${this.email} about ${eventData.name}`);
        this.emailService.sendEmail(this.email, eventData);
      }
}
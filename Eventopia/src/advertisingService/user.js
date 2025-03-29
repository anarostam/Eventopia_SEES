export class User {
    constructor(email) {
      this.email = email;
    }
    
    update(eventData) {
        console.log(`Sending email to ${this.email} about ${eventData.name}`);
        
        const text = `📅 New Event: ${eventData.name}\nDetails: ${eventData.description}\nVenue: ${eventData.date}\nDate: ${eventData.date}\nTime: ${eventData.time}`;

         fetch('http://localhost:4000/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              to: this.email,
              subject: `🆕 New Event: ${eventData.name}`,
              text: text
          })
      })
      .then(res => res.json())
      .then(data => console.log(`Email sent to ${this.email}:`, data))
      .catch(err => console.error(`Failed to send email to ${this.email}:`, err));
    }
  }
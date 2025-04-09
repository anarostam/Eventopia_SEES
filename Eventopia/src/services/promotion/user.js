export class User {
    constructor(email) {
      this.email = email;
    }
    
    update(eventData) {
        console.log(`Sending email to ${this.email} about ${eventData.name}`);
        
        const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">📅 Register for ${eventData.name} now!</h2>
          <img src="${eventData.picture_url}" alt="${eventData.name}" style="width:100%; max-width:600px; border-radius:10px;" />
          <p><strong>Description:</strong> ${eventData.description}</p>
          <p><strong>Venue:</strong> ${eventData.venue}</p>
          <p><strong>Date:</strong> ${eventData.date}</p>
          <p><strong>Time:</strong> ${eventData.time}</p>
          <p><strong>Price:</strong> ${eventData.price}</p>
          <p><a href="${eventData.registration_link}" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;">Register Now</a></p>
        </div>
      `;
  
      const text = `
  📅 Register for ${eventData.name} now!
  Description: ${eventData.description}
  Venue: ${eventData.venue}
  Date: ${eventData.date}
  Time: ${eventData.time}
  Price: ${eventData.price}
  Registration Link: ${eventData.registration_link}
      `;

         fetch('http://localhost:4000/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              to: this.email,
              subject: `🆕 New Event Available on Eventopia: ${eventData.name}`,
              text: text,
              html: html
          })
      })
      .then(res => res.json())
      .then(data => console.log(`Email sent to ${this.email}:`, data))
      .catch(err => console.error(`Failed to send email to ${this.email}:`, err));
    }
  }
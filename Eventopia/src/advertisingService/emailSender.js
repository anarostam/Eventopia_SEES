import axios from "axios";

export class EmailSender {
  constructor(apiKey, fromEmail) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendEmail(email, eventData) {
    const message = `📅 New Event: ${eventData.name}\nDetails: ${eventData.description}`;

    try {
      await axios.post(
        "https://api.resend.com/emails",
        {
          from: this.fromEmail,
          to: email,
          subject: "📅 New Event!",
          text: message,
        },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );

      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  }
}
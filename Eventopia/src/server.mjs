// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eventopia9@gmail.com',   
        pass: 'xzcr grhl lvei pkzm'        
    }
});

// Send emails
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text, html} = req.body;

    try {
        await transporter.sendMail({
            from: 'eventopia9@gmail.com',
            to,
            subject,
            text,
            html
        });
        console.log(`Email sent to ${to}`);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});
  
app.listen(4000, () => console.log('Backend running on http://localhost:4000'));

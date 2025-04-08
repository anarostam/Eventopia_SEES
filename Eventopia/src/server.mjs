// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createPoll, submitVote, getPollResults } from './services/polling/pollService.js'; 

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

// Create poll
app.post('/api/polls', async (req, res) => {
    const { speaker_id, question, options } = req.body;
  
    try {
        const poll = await createPoll(speaker_id, question, options);
        res.status(201).json(poll);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  
  // 🔸 Vote
  app.post('/api/polls/:pollId/vote', async (req, res) => {
    const { pollId } = req.params;
    const { respondent, option_id } = req.body;
  
    try {
        const result = await voteOnPoll(pollId, respondent, option_id);
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
  
  // 🔸 Get Poll Results
  app.get('/api/polls/:pollId/results', async (req, res) => {
    const { pollId } = req.params;
  
    try {
        const results = await getPollResults(pollId);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  
app.listen(4000, () => console.log('Backend running on http://localhost:4000'));

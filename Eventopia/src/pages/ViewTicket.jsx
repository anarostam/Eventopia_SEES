import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css-folder/ViewTicket.css';

const ViewTicket = () => {
    const [ticket, setTicket] = useState(null);
    const navigate = useNavigate();

    // Fetch the ticket details from localStorage (or API)
    useEffect(() => {
        const storedTicket = JSON.parse(localStorage.getItem('ticket'));
        if (!storedTicket) {
            // Redirect to profile page if no ticket is found
            navigate('/profile');
        } else {
            setTicket(storedTicket);
        }
    }, [navigate]);

    if (!ticket) {
        return (
            <div className="container mt-5">
                <p>No ticket information available.</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Ticket</h1>

            <div className="ticket-card">
                <h3>Ticket Details</h3>
                <p><strong>Name:</strong> {ticket.name}</p>
                <p><strong>Event Name:</strong> {ticket.eventName}</p>
                <p><strong>Event Time:</strong> {ticket.eventTime}</p>
            </div>
        </div>
    );
};

export default ViewTicket;
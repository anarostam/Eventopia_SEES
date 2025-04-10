import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Css-folder/ViewTicket.css';
import { supabase } from '../Client';
import { QRCodeSVG } from 'qrcode.react';

const ViewTicket = () => {
    const [ticket, setTicket] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState(null);
    const [eventInfo, setEventInfo] = useState(null);

    useEffect(() => {
        const getTicketData = async() => {
            const { state } = location;

            if (!state) {
                console.error("Missing ticket data from location.state");
                return;
            }

            const storedUser = JSON.parse(localStorage.getItem("user"));

            const { data: userData, error: userError } = await supabase  // query user table to get the logged in user's id
            .from('user')
            .select('*')
            .eq('email', storedUser.email)
            .single();

            if (userError || userData === null) {
                console.error("Error fetching user: ", userError);
                return;
            }

            console.log("Queried user's name: ", userData.name);

            setUsername(userData.name);

            const { data: eventData, error: eventDataError } = await supabase
                .from('event')
                .select('name, venue, date, time')
                .eq('id', state.eventId)
                .single();  // get the event information from the event table in supabase

            if (eventDataError || eventData === null) {
                console.error("Error fetching event: ", eventDataError);
                return;
            }

            setEventInfo(eventData);

            setTicket(state);
        };

        getTicketData()
    }, [location, navigate]);

    if (!ticket || !eventInfo || !username) {
        return (
            <div className="container mt-5">
                <p>Loading ticket info...</p>
            </div>
        );
    }

    // Create a unique ticket identifier for the QR code
    const ticketData = JSON.stringify({
        eventId: ticket.eventId,
        userId: username,
        eventName: eventInfo.name,
        date: eventInfo.date,
        time: eventInfo.time
    });

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Ticket</h1>

            <div className="ticket-card">
                <h3>Ticket Details</h3>
                <p><strong>Name:</strong> {username}</p>
                <p><strong>Event Name:</strong> {eventInfo.name}</p>
                <p><strong>Event Time:</strong> {eventInfo.time}</p>
                <p><strong>Event Date:</strong> {eventInfo.date}</p>
                <p><strong>Event Venue:</strong> {eventInfo.venue}</p>
                <p><strong>Payment ID:</strong> {ticket.paymentId}</p>
                
                <div className="qr-code-container">
                    <QRCodeSVG 
                        value={ticketData}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewTicket;
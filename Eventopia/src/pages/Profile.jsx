

import React, { useEffect, useState } from "react";
import "../Css-folder/index.css";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // redirect to login if not logged in
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  const { name, role } = user;

  const roleText = {
    1: "Admin",
    2: "Attendee",
    3: "Organizer",
    4: "Stakeholder",
  };

  return (
    <div className="s-container">
      <h1>Welcome, {name}!</h1>
      <p className="text-muted">Role: {roleText[role] || "Unknown"}</p>

      <div className="btn-group mt-4">
        {/* Admin */}
        {role === 1 && (
          <>
            <Link to="/AddEvent">
              <button className="btn btn-primary">Add an Event</button>
            </Link>
            <Link to="/AddVenue">
              <button className="btn btn-primary">Add a Venue</button>
            </Link>
            <Link to="/ViewEvent">
              <button className="btn btn-secondary">View Events</button>
            </Link>
            <Link to="/ViewVenue">
              <button className="btn btn-secondary">View Venues</button>
            </Link>
          </>
        )}

        {/* Attendee */}
        {role === 2 && (
          <>
            <Link to="/ViewEvent">
              <button className="btn btn-primary">Browse Events</button>
            </Link>
            <Link to="/ViewVenue">
              <button className="btn btn-primary">Browse Venues</button>
            </Link>
          </>
        )}

        {/* Organizer */}
        {role === 3 && (
          <>
            <p>Organizer-specific controls coming soon...</p>
          </>
        )}

        {/* Stakeholder */}
        {role === 4 && (
          <>
            <p>Stakeholder view coming soon...</p>
          </>
        )}
      </div>

      <br /><br />
    </div>
  );
};

export default Profile;

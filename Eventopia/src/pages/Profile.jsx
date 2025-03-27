
import React, { useEffect, useState } from "react";
import "../Css-folder/index.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Client";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !sessionData.user) {
        navigate("/login");
        return;
      }

      const email = sessionData.user.email;
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/login");
        return;
      }

      setUser({ ...storedUser, email });
    };

    fetchUserData();
  }, [navigate]);

  if (!user) return null;

  const roleText = {
    1: "Admin",
    2: "Attendee",
    3: "Organizer",
    4: "Stakeholder",
  };

  return (
    <div className="s-container">
      <h1>Welcome, {user.name}!</h1>
      <p className="text-muted">Role: {roleText[user.role] || "Unknown"}</p>

      <div className="btn-group mt-4">
        {user.role === 1 && (
          <>
            <Link to="/AddEvent"><button className="btn btn-primary">Add an Event</button></Link>
            <Link to="/AddVenue"><button className="btn btn-primary">Add a Venue</button></Link>
            <Link to="/ViewEvent"><button className="btn btn-secondary">View Events</button></Link>
            <Link to="/ViewVenue"><button className="btn btn-secondary">View Venues</button></Link>
          </>
        )}

        {user.role === 2 && (
          <>
            <Link to="/ViewEvent"><button className="btn btn-primary">Browse Events</button></Link>
            <Link to="/ViewVenue"><button className="btn btn-primary">Browse Venues</button></Link>
          </>
        )}

        {user.role === 3 && <p>Organizer-specific controls coming soon...</p>}
        {user.role === 4 && <p>Stakeholder view coming soon...</p>}
      </div>
    </div>
  );
};

export default Profile;

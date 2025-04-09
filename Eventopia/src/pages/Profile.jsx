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
    5: "Speaker"
  };

  return (
    <div className="s-container">
      <h1>Welcome, {user.name}!</h1>
      <p className="text-muted">Role: {roleText[user.role] || "Unknown"}</p>

      <div className="btn-group mt-4">
        {user.role === 1 && (
          <>
            <div className="section">
              {/* Event Section */}
              <div className="Event">
                {/* <h2>Events</h2> */}

                <Link to="/AddEvent">
                  <button className="btn btn-primary">Add Event</button>
                </Link>
                <Link to="/ManageEvent">
                  <button className="btn btn-secondary">Manage Event</button>
                </Link>
                <Link to="/ViewEvent">
                  <button className="btn btn-secondary">View Event</button>
                </Link>
                {/* <Link to="/Register">
                  <button className="btn btn-secondary">Sign Up </button>
                </Link> */}
              </div>
              <br />

              {/* Venue Section */}
              <div className="Venue">
                {/* <h2>Venues</h2> */}
                <Link to="/AddVenue">
                  <button className="btn btn-primary">Add Venue</button>
                </Link>
                <Link to="/ManageVenue">
                  <button className="btn btn-secondary">Manage Venue</button>
                </Link>
                <Link to="/ViewVenue">
                  <button className="btn btn-secondary">View Venue</button>
                </Link>
                <Link to="/letschat" state={{ user }}>
                  <button className="btn btn-success">Let's Chat</button>
                </Link>
              </div>
            </div>
          </>
        )}

        {user.role === 2 && (
          <>
            <Link to="/ViewVenue"><button className="btn btn-primary">Browse Venues</button></Link>
            <Link to="/MyEvents"><button className="btn btn-primary">My Events</button></Link>
            <Link to="/ViewPoll"><button className="btn btn-primary">View Poll</button></Link>
            <Link to="/letschat" state={{ user }}>
              <button className="btn btn-success">Let's Chat</button>
            </Link>

          </>
        )}

        {user.role === 3 && (

          <Link to="/letschat" state={{ user }}>
            <button className="btn btn-success">Let's Chat</button>
          </Link>
        )}
        {user.role === 4 && (

          <Link to="/letschat" state={{ user }}>
            <button className="btn btn-success">Let's Chat</button>
          </Link>
        )}
        {user.role === 5 && (
          <>
            <Link to="/ViewEvent"><button className="btn btn-primary">Browse Events</button></Link>
            <Link to="/ViewVenue"><button className="btn btn-primary">Browse Venues</button></Link>
            <Link to="/AddPoll"><button className="btn btn-primary">Create poll</button></Link>
            <Link to="/AllPolls"><button className="btn btn-primary">Check polls</button></Link>
            <Link to="/letschat" state={{ user }}>
              <button className="btn btn-success">Let's Chat</button>
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Profile;

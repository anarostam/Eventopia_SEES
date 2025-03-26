import React, { useEffect, useState } from "react";
import "../Css-folder/index.css";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Store profile image
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      setUser(storedUser);
      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage(storedImage);
      }
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

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set profile image to state
        localStorage.setItem("profileImage", reader.result); // Save to localStorage
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  return (
    <div className="s-container">
      <h1>Welcome, {name}!</h1>
      <p className="text-muted">Role: {roleText[role] || "Unknown"}</p>

      {/* Profile image container */}
      <div className="profile-image-container">
        <label htmlFor="imageUpload" className="profile-image-label">
          <img
            src={profileImage || "https://via.placeholder.com/100"}
            alt="Profile"
            className="profile-image"
          />
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="profile-image-upload"
        />
      </div>

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

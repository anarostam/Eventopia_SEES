
import React, { useEffect, useState } from "react";
import "../Css-folder/index.css";
import { Link, useNavigate } from "react-router-dom";
import { uploadProfilePicture, fetchUserProfile,} from "./Profileback";
import { supabase } from "../Client";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate("/login"); // Redirect if not authenticated
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/login"); // Redirect to login if not logged in
        return;
      }

      setUser({
        ...storedUser, // Ensure the user object is spread properly
        email: data.user.email,
      });

      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage(storedImage);
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return null;

  const { name, role } = user;

  const roleText = {
    1: "Admin",
    2: "Attendee",
    3: "Organizer",
    4: "Stakeholder",
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const { success, publicUrl, message } = await uploadProfilePicture(file);
    if (success) {
      setProfileImage(publicUrl);
      localStorage.setItem("profileImage", publicUrl);
    } else {
      console.error("Upload failed:", message);
      alert("Failed to upload image: " + message);
    }
  };

  return (
    <div className="s-container">
      <h1>Welcome, {name}!</h1>
      <p className="text-muted">Role: {roleText[role] || "Unknown"}</p>

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
            <Link to="/ManageEvent">
              <button className="btn btn-secondary">Manage Event</button>
            </Link>
            <Link to="/ManageVenue">
              <button className="btn btn-secondary">Manage Venue</button>
            </Link>
          </>
        )}

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

        {role === 3 && <p>Organizer-specific controls coming soon...</p>}
        {role === 4 && <p>Stakeholder view coming soon...</p>}
      </div>
    </div>
  );
};

export default Profile;

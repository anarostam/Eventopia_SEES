import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../Client';

const Header = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/50");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !sessionData?.user) {
        setUser(null);
        return;
      }

      const email = sessionData.user.email;
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("user")
        .select("profilepic")
        .eq("email", email)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
      }

      if (profileData?.profilepic) {
        setProfileImage(profileData.profilepic);
      }

      setUser({ ...storedUser, email });
    };

    fetchUserData();
  }, [navigate]);

  const logoutClick = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };



const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.email) return;
  
    // ✅ UNIQUE FILE NAME TO BUST CACHE
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.email}-${timestamp}.${fileExt}`;
    const filePath = `profilepictures/${fileName}`;
  
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profilepictures")
      .upload(filePath, file);
  
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      alert("Failed to upload profile image.");
      return;
    }
  
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from("profilepictures")
      .getPublicUrl(filePath);
  
    const imageUrl = urlData.publicUrl;
    setProfileImage(imageUrl);
  
    // Save to Supabase user table
    const { error: updateError } = await supabase
      .from("user")
      .update({ profilepic: imageUrl })
      .eq("email", user.email);
  
    if (updateError) {
      console.error("Update error:", updateError.message);
      alert("Failed to save image to profile.");
    }
  };
  
  return (
    <div className="header">
      <div>
        <Link id="header-logo" to="/">Eventopia</Link>
      </div>

      <div className="links--wrapper">
        <Link to="/" className="header--link">Home</Link>

        {user ? (
          <>
            <Link to="/profile" className="header--link">Profile</Link>
            <button onClick={logoutClick} className="btn">Log Out</button>

            {/* Profile Image Upload from Header */}
            <label htmlFor="headerImageUpload">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image-header"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  objectFit: 'cover'
                }}
              />
            </label>
            <input
              type="file"
              id="headerImageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </>
        ) : (
          <Link className="btn" to="/login">Log In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;

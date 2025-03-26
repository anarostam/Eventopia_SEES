// import React, { useEffect, useState } from "react";
// import "../Css-folder/index.css";
// import { Link, useNavigate } from "react-router-dom";
// import { ProfileBackend } from "./Profileback";
// import { supabase } from "../Client";
// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState(null); // Store profile image
//   const navigate = useNavigate();

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// import React, { useEffect, useState } from "react";
// import "../Css-folder/index.css";
// import { Link, useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState(null); // Store profile image
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login"); // Redirect to login if not logged in
//     } else {
//       setUser(storedUser);
// import React, { useEffect, useState } from "react";
// import "../Css-folder/index.css";
// import { Link, useNavigate } from "react-router-dom";
// import { ProfileBackend } from "./Profileback";
// import { supabase } from "../Client";
// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState(null); // Store profile image
//   const navigate = useNavigate();

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: userData, error } = await supabase.auth.getUser();
//       if (error || !userData?.user) {
//         navigate("/login"); // Redirect if not authenticated
//         return;
//       }}
//     const storedUser = JSON.parse(localStorage.getItem("user")) || {};
//     if (!storedUser) {
//       navigate("/login"); // Redirect to login if not logged in
//     } else {
//       setUser({storedUser, email: userData.user.email});
//       const storedImage = localStorage.getItem("profileImage");
//       if (storedImage) {
//         setProfileImage(storedImage);
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   if (!user) return null;

//   const { name, role } = user;

//   const roleText = {
//     1: "Admin",
//     2: "Attendee",
//     3: "Organizer",
//     4: "Stakeholder",
//   };

//   // Handle image upload
//   const handleImageUpload = async (event) => {
//     if(!user?.email){
//       console.error("User email is missing");
//       return;
//     }
//     const file = event.target.files[0];
//     if (!file || !user) return; 
//     //   reader.onloadend = () => {
//     //     setProfileImage(reader.result); // Set profile image to state
//     //     localStorage.setItem("profileImage", reader.result); // Save to localStorage
//     //   };
//     //   reader.readAsDataURL(file); // Convert image to base64
//     // }
//     const filePath = await ProfileBackend.uploadProfilePicture(file, user.email);
//   if (filePath) {
//     const profilePicURL = await ProfileBackend.getProfilePictureURL(filePath);
//     setProfileImage(profilePicURL);
//   }
//   };

//   return (
//     <div className="s-container">
//       <h1>Welcome, {name}!</h1>
//       <p className="text-muted">Role: {roleText[role] || "Unknown"}</p>

//       {/* Profile image container */}
//       <div className="profile-image-container">
//         <label htmlFor="imageUpload" className="profile-image-label">
//           <img
//             src={profileImage || "https://via.placeholder.com/100"}
//             alt="Profile"
//             className="profile-image"
//           />
//         </label>
//         <input
//           type="file"
//           id="imageUpload"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="profile-image-upload"
//         />
//       </div>

//       <div className="btn-group mt-4">
//         {/* Admin */}
//         {role === 1 && (
//           <>
//             <Link to="/AddEvent">
//               <button className="btn btn-primary">Add an Event</button>
//             </Link>
//             <Link to="/AddVenue">
//               <button className="btn btn-primary">Add a Venue</button>
//             </Link>
//             <Link to="/ViewEvent">
//               <button className="btn btn-secondary">View Events</button>
//             </Link>
//             <Link to="/ViewVenue">
//               <button className="btn btn-secondary">View Venues</button>
//             </Link>
//           </>
//         )}

//         {/* Attendee */}
//         {role === 2 && (
//           <>
//             <Link to="/ViewEvent">
//               <button className="btn btn-primary">Browse Events</button>
//             </Link>
//             <Link to="/ViewVenue">
//               <button className="btn btn-primary">Browse Venues</button>
//             </Link>
//           </>
//         )}

//         {/* Organizer */}
//         {role === 3 && (
//           <>
//             <p>Organizer-specific controls coming soon...</p>
//           </>
//         )}

//         {/* Stakeholder */}
//         {role === 4 && (
//           <>
//             <p>Stakeholder view coming soon...</p>
//           </>
//         )}
//       </div>

//       <br /><br />
//     </div>
//   );
// };

// export default Profile;
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream


=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======

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
=======
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
>>>>>>> Stashed changes
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
>>>>>>> Stashed changes
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
            <Link to="/ManageEvent">
              <button className="btn btn-secondary">Manage Event</button>
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

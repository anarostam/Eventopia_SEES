// import React from 'react';
// import '../Css-folder/index.css';
// import { Link } from 'react-router-dom';

// const Profile = () => {
//   return (
//     <div className="s-container">
//       <h1>Welcome to my profile!</h1>

//       <br />
//       <br />
//       <br />

//       <div className="btn-group">
//         <Link to="/AddEvent">
//           <button className="btn btn-primary active" aria-current="page">Add a Event</button>
//         </Link>
//         <Link to="/ViewEvent">
//         <button className="btn btn-primary">View Event</button>
//         </Link>
//         <Link to="/AddVenue">
//         <button className="btn btn-primary"> Add a Venue</button>
//         </Link>
//       </div>

//       <br />
//       <br />
//       <br />

//     </div>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import "../Css-folder/index.css";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  return (
    <div className="s-container">
      <h1>Welcome, {userName}!</h1>

      <br />
      <br />
      <div className="btn-group">
        <Link to="/AddEvent">
          <button className="btn btn-primary">Add a Event</button>
        </Link>
        <Link to="/ViewEvent">
          <button className="btn btn-primary">View Event</button>
        </Link>
        <Link to="/AddVenue">
          <button className="btn btn-primary">Add a Venue</button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;

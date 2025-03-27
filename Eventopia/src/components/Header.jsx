import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const profileImage = localStorage.getItem("profileImage");

    const logoutClick = () => {
        localStorage.removeItem('user'); 
        localStorage.removeItem("profileImage"); 
        navigate('/login'); 
    };

    return (
        <div className="header">
            <div>
                <Link id="header-logo" to="/">Eventopia</Link>
            </div>

            <div className="links--wrapper">
                <>
                    <Link to="/" className="header--link">Home</Link>

                    {user ? (
                        <>
                            <Link to="/profile" className="header--link">Profile</Link>
                            <button onClick={logoutClick} className="btn">Log Out</button>

                            <img
                                src={profileImage || 'https://via.placeholder.com/50'}
                                alt="Profile"
                                className="profile-image-header"
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                        </>
                    ) : (
                        <Link className="btn" to="/login">Log In</Link> 
                    )}
                </>
            </div>
        </div>
    );
};

export default Header;

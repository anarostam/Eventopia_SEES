
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css-folder/index.css"; // adjust path as needed
import { loginUser } from "./LoginBack";
import { Link } from "react-router-dom";


const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { success, user, message } = await loginUser(formData);

    if (!success) {
      setError(message || "Login failed.");
      return;
    }

    setUser(user); // Save user state globally
    localStorage.setItem("user", JSON.stringify(user)); // Optional for persistence
    navigate("/profile"); // Redirect to profile page
  };

  return (
    <div className="s-container">
      <div className="login-register-container">
        <form onSubmit={handleSubmit}>
          <div className="form-field-wrapper">
            <label>Email:</label>
            <input type="email" name="email" required onChange={handleChange} />
          </div>

          <div className="form-field-wrapper">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-field-wrapper">
            <input type="submit" value="Login" className="btn" />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        {/* <p>Don't have an account? <a href="/register">Sign up</a></p> */}
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;


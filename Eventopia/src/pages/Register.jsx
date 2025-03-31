import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import '../Css-folder/index.css'
import './Signup'
import {handleSubmit} from './Signup'
import {handleChange} from './Signup'

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });
  
  return (
    <div className="s-container">
      <div className="login-register-container">
        <form
        
        onSubmit={(e) => handleSubmit(e, formData)}
        >

          <div className="form-field-wrapper">
                <label>Name:</label>
                <input 
                  required
                  onChange={(e) => handleChange(e, setFormData)}
                  type="text" 
                  name="name"
                  placeholder="Enter name..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Email:</label>
                <input 
                  required
                  onChange={(e) => handleChange(e, setFormData)}
                  type="email" 
                  name="email"
                  placeholder="Enter email..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Password:</label>
                <input 
                onChange={(e) => handleChange(e, setFormData)}
                  type="password"
                  name="password1" 
                  placeholder="Enter password..."
                  />
            </div>

            <div className="form-field-wrapper">
                <label>Confirm Password:</label>
                <input 
                onChange={(e) => handleChange(e, setFormData)}
                  type="password"
                  name="password2" 
                  placeholder="Confirm password..."
                  />
            </div>

            <div className="form-field-wrapper">
            <label>Role:</label>
            <select name="role" required onChange={(e) => handleChange(e, setFormData)}>
              <option value="">Select Role</option>
              <option value="stakeholder">Stakeholder</option>
              <option value="attendee">Attendee</option>
              <option value="admin">Admin</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>


            <div className="form-field-wrapper">

                <input 
                  type="submit" 
                  value="Register"
                  className="btn"
                  />

            </div>

        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>

      </div>
  </div>
  )
}

export default Register
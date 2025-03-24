// Footer.jsx

import React from 'react';
import '../Css-folder/footer.css';

const Footer = () => {
  return (
    <div>
      <footer className="site-footer">
        <div className="fcontainer">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6>About Eventopia</h6>
              <p className="text-justify">
              Eventopia is a cutting-edge platform designed to simplify the planning, execution, and management of educational events. From conferences and workshops to seminars and webinars, Eventopia streamlines every aspect of event coordination. It enhances user engagement through seamless attendee management, real-time analytics, and effective networking opportunities. Whether in-person, online, or hybrid. Our platform prioritizes user privacy and data security, ensuring that the entire event experience is smooth and efficient for all involved.            </p>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Resources</h6>
              <ul className="footer-links">
                <li className="li-1">
                  <a href="/user-guide">User-Guide</a>
                </li>
                <li className="li-2">
                  <a href="/faq">FAQ</a>
                </li>
              </ul>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li className="li-3">
                  <a href="/about-us">About Us</a>
                </li>
                <li className="li-4">
                  <a href="/contact-us">Contact Us</a>
                </li>
                <li className="li-5">
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <hr />
        </div>
        <div className="fcontainer">
          <div className="row">
            <div className="col-md-8 col-sm-6 col-xs-12">
              <p className="copyright-text">
                Copyright &copy; 2024 All Rights Reserved by <a href="/team-godlike"> Eventopia</a>.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
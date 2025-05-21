import React from "react";
import { FaEnvelope, FaPhone, FaQuestionCircle, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/schemes">Browse Schemes</a></li>
            <li><a href="/eligibility">Eligibility Check</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li><FaEnvelope /> <a href="mailto:support@divyasarthi.org">support@divyasarthi.org</a></li>
            <li><FaPhone /> <a href="tel:+18005551234">(+91) 6378556859</a></li>
            <li><FaQuestionCircle /> <a href="/help">Help Center</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
          <p className="newsletter-text">Subscribe to our newsletter</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DivyaSarthi. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
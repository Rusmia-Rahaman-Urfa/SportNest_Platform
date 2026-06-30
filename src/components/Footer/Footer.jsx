import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Youtube, Github } from "lucide-react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-grid">
        <div>
          <Link to="/" className="footer-logo">⚡ Sport<span>Nest</span></Link>
          <p className="footer-desc">Your arena awaits. Book premium sports facilities in seconds — football turfs, badminton courts, swimming lanes and more.</p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a>
            <a href="https://youtube.com"   target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17}/></a>
            <a href="https://github.com"    target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a>
            {/* X — new Twitter logo as required by PDF */}
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.729-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {[["/","Home"],["/facilities","All Facilities"],["/my-bookings","My Bookings"],["/add-facility","List Your Venue"]].map(([to,label]) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Sports</h4>
          <ul className="footer-links">
            {["Football","Cricket","Basketball","Badminton","Tennis","Swimming"].map(s => (
              <li key={s}><Link to={`/facilities?type=${s}`}>{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact">
            <li><MapPin size={14}/><span>123 Sport Ave, Dhaka, Bangladesh</span></li>
            <li><Phone size={14}/><a href="tel:+8801700000000">+880 1700-000000</a></li>
            <li><Mail size={14}/><a href="mailto:hello@sportnest.com">hello@sportnest.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SportNest. All rights reserved. Built for champions.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;

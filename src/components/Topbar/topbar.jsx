import React from "react";
import "./topbar.scss";
import { HashLink as Link1 } from "react-router-hash-link";
import { Link, NavLink } from "react-router-dom";

export default function Topbar({ scrollToSection, menuOpen, setMenuOpen }) {
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav>
        <div className="title">
          <div className="icon">
            <img src="assets/AnyonyamLogo.png" alt="" />
          </div>
          <div>
            <Link to="/" className="logo">
              <img src="assets/logo.png" alt="img here" />
            </Link>
          </div>
        </div>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }} onClick={handleLinkClick}>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/About/History" style={{ textDecoration: 'none', color: 'white' }} onClick={handleLinkClick}>
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/Gallery" style={{ textDecoration: 'none', color: 'white' }} onClick={handleLinkClick}>
              <span>Gallery</span>
            </Link>
          </li>
          <li>
            <Link1 smooth to="/#contact" style={{ textDecoration: 'none', color: 'white' }} onClick={handleLinkClick}>
              <span>Contact Us</span>
            </Link1>
          </li>
          <li>
            <Link to="/login" style={{ textDecoration: 'none', color: 'white' }} onClick={handleLinkClick}>
              <span>Login</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className={`overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}></div>
    </>
  );
}

import React from "react";
import "./topbar.scss";
import {Link} from 'react-router-dom';
import { HashLink as Link1 } from "react-router-hash-link";

export default function Topbar({scrollToSection, menuOpen, setMenuOpen }) {



  return (
    <div className={`Topbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="wrapper">
        <div className="left">
          <div className="icon">
            <img src="assets/AnyonyamLogo.png" alt="" />
          </div>
          <div>
          <Link to="/" className="logo">
              <img src="assets/logo.png" alt="img here" />
            </Link>
          </div>
        </div>
        <div className="center">
          <div
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={()=>setMenuOpen(!menuOpen)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <div className={`menu ${menuOpen ? "open" : ""}`}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}><span >Home</span></Link>
            <Link to="/About/History" style={{ textDecoration: 'none', color: 'white' }}><span >About Us</span></Link>
            <Link to="/Gallery" style={{ textDecoration: 'none', color: 'white' }}><span >Gallery</span></Link>
            <Link1 smooth to="/#contact" style={{ textDecoration: 'none', color: 'white' }}><span>Contact Us</span></Link1>
            <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}><span >Login</span></Link>
            {/* <span onClick={() => setState("Home")}>Home</span>
            <span onClick={() => setState("About")}>About Us</span>
            <span onClick={() => setState("Gallery")}>Gallery</span>
            <span onClick={handleButtonClick}>Contact Us</span>
            <span onClick={() => setState("Login")}>Login</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

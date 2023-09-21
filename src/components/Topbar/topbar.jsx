import React from "react";
import "./topbar.scss";

export default function Topbar({ state, setState, scrollToSection, menuOpen, setMenuOpen }) {

  const handleButtonClick = () => {
    setState("Home");
    setTimeout(() => {
      scrollToSection();
    }, 100); 
  };



  return (
    <div className={`Topbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="wrapper">
        <div className="left">
          <div className="icon">
            <img src="assets/AnyonyamLogo.png" alt="" />
          </div>
          <div>
            <a href="#intro" className="logo">
              <img
                src="assets/logo.png"
                alt="img here"
                onClick={() => setState("Home")}
              />
            </a>
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
            <span onClick={() => setState("Home")}>Home</span>
            <span onClick={() => setState("About")}>About Us</span>
            <span onClick={() => setState("Gallery")}>Gallery</span>
            <span onClick={handleButtonClick}>Contact Us</span>
          </div>
        </div>
      </div>
    </div>
  );
}

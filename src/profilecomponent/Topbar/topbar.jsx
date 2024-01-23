import React from "react";
import "./topbar.scss";
import {Route, Link, Routes, useNavigate} from 'react-router-dom';


export default function TopbarProf({ state, setState, menuOpen, setMenuOpen, loggedInUser}) {

  const memberNo = localStorage.getItem("memberNo")
  const nav = useNavigate()
  // console.log("Coming from Topbar")
  // console.log(memberNo)

  const handleImageClick = () => {
      
  }

  return (
    <div className={`Topbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="wrapper">
        <div className="left">
          <div className="icon">
            <img src="/assets/AnyonyamLogo.png" alt="" />
          </div>
          <div>
            <a className="logo">
              <img
                src="/assets/logo.png"
                alt="img here"
                onClick= {()=>nav(`/Profile/${memberNo}`)}
                style={{ cursor: 'pointer'}}
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
            <Link to={`/Profile/${memberNo}`} style={{ textDecoration: 'none', color: 'white' }}><span>Profile</span></Link>
            <Link to="/Search" style={{ textDecoration: 'none', color: 'white' }}><span>Search</span></Link>
            <Link to="/Logout" style={{ textDecoration: 'none', color: 'white' }}><span>Logout</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

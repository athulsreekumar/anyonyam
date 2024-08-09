import React from "react";
import "./topbar.scss";
import {Link, useNavigate} from 'react-router-dom';

export default function TopbarProf({ state, setState, menuOpen, setMenuOpen, loggedInUser }) {
  const memberNo = localStorage.getItem("memberNo")
  const nav = useNavigate()
  // console.log("Coming from Topbar")
  // console.log(memberNo)

  return (
    <>
    <nav>
      <div className="title">
        <div className="icon">
          <img src="/assets/AnyonyamLogo.png" alt="" />
        </div>
        <div>
          <Link to="/" className="logo">
            <img
              src="/assets/logo.png"
              alt="img here"
              onClick={() => nav(`/Profile/${memberNo}`)}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>
      </div>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        {localStorage.getItem("isAdmin") == "true" && (
          <li>
            <Link to="/Admin" style={{ textDecoration: 'none', color: 'white' }}>
              <span>Admin</span>
            </Link>
          </li>
        )}
        <li>
          <Link to={`/Profile/${memberNo}`} style={{ textDecoration: 'none', color: 'white' }}>
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/Search" style={{ textDecoration: 'none', color: 'white' }}>
            <span>Search</span>
          </Link>
        </li>
        <li>
          <Link to="/Logout" style={{ textDecoration: 'none', color: 'white' }}>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </nav>
    <div className={`overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}></div>
    </>
  );
}

import React from "react";
import "./topbar.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext";

export default function TopbarProf({ menuOpen, setMenuOpen }) {
  const { memberNo, isAdmin, name } = useAuth();
  const nav = useNavigate();

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
        {name && <div className="greeting">Hi, {name}</div>}
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          {isAdmin && (
            <li>
              <Link to="/Admin" onClick={() => setMenuOpen(false)}>
                <span>Admin</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={`/Profile/${memberNo}`} onClick={() => setMenuOpen(false)}>
              <span>Profile</span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/Search" onClick={() => setMenuOpen(false)}>
                <span>Search</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/Logout" onClick={() => setMenuOpen(false)}>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className={`overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}></div>
    </>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import './app2.scss';
import Topbar from './components/Topbar/topbar.jsx';
import Intro from './components/Intro/intro';
import Contact from "./components/Contact/contact.jsx";
import Event from "./components/Event/event.jsx";
import Footer from "./components/Footer/footer.jsx";
import History from "./components/History/history.jsx";
import Today from "./components/Today/today.jsx";
import Gallery from "./components/Gallery/gallery.jsx";
import Login from "./components/Login/login4.jsx";
import TopbarProf from "./profilecomponent/Topbar/topbar.jsx";
import Profile from "./profilecomponent/Profile/profile2.jsx";
import Search from "./profilecomponent/Search/search.jsx";
import Logout from "./profilecomponent/Logout/logout.jsx";
import Admin from "./profilecomponent/admin/admin.jsx";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const memberNo = 103;
  const sectionRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("user-auth-token");
    setLoggedIn(!!token);
  }, []);

  const nav = useNavigate();

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
    // localStorage.setItem("memberNo", `${loggedInUser.memberNo}`);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem("user-auth-token"); // Remove token from localStorage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("memberNo");
    localStorage.removeItem("isAdmin");
    nav("/");
  };





  return (
    <div className="App">
      <div className="NavBar">
        {!localStorage.getItem("loggedIn") && (<>
          <Topbar scrollToSection={scrollToSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>)}

        {localStorage.getItem("loggedIn") && (<>
          <TopbarProf menuOpen={menuOpen} setMenuOpen={setMenuOpen} loggedInUser={loggedInUser} memberNo={memberNo} />
        </>)}
      </div>


      <div className="components">
        <Routes>
          <Route path="/" element={
            <>
              <Intro />
              <Event />
              <div id="contact">
                <Contact />
              </div>
              <Footer />
            </>
          } />
          <Route path="/About/History" element={<History />} />
          <Route path="/About/Today" element={<Today />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Login" element={<Login onLogin={handleLogin} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />

          <Route path={`/Admin`} element={<Admin loggedInUser={loggedInUser} />} />
          <Route path={`/Profile/:memberNo`} element={<Profile />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Logout" element={<Logout onLogout={handleLogout} />} />

        </Routes>
      </div>

    </div>
  );
}

export default App;

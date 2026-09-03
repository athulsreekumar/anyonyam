import React, { useRef } from "react";
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
import RequireAuth from "./auth/RequireAuth.jsx";
import RequireAdmin from "./auth/RequireAdmin.jsx";
import { useAuth } from "./auth/AuthContext";
import { useMenu } from "./hooks/useMenu";

function App() {
  const { isAuthenticated, name } = useAuth();
  const { menuOpen, setMenuOpen } = useMenu();
  const sectionRef = useRef(null);
  const nav = useNavigate();

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="App">
      <div className="NavBar">
        {isAuthenticated ? (
          <TopbarProf menuOpen={menuOpen} setMenuOpen={setMenuOpen} name={name} />
        ) : (
          <Topbar scrollToSection={scrollToSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        )}
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
          <Route
            path="/Login"
            element={<Login onLoggedIn={(memberNo) => nav(`/Profile/${memberNo}`)} />}
          />

          <Route
            path="/Admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
          <Route
            path="/Profile/:memberNo"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/Search"
            element={
              <RequireAdmin>
                <Search />
              </RequireAdmin>
            }
          />
          <Route path="/Logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

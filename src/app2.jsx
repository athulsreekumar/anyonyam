import React, { useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar/topbar.jsx";
import Intro from "./components/Intro/intro.jsx";
import Contact from "./components/Contact/contact.jsx";
import Event from "./components/Event/event.jsx";
import Footer from "./components/Footer/footer.jsx";
import History from "./components/History/history.jsx";
import Today from "./components/Today/today.jsx";
import Gallery from "./components/Gallery/gallery.jsx";
import Menu from "./components/Menu/menu.jsx";
import Login from "./components/Login/login4.jsx";
import TopbarProf from "./profilecomponent/Topbar/topbar.jsx";
import Profile from "./profilecomponent/Profile/profile2.jsx";
import Search from "./profilecomponent/Search/search.jsx";
import Logout from "./profilecomponent/Logout/logout.jsx";

import "./app2.scss";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const memberNo = 103;
    const sectionRef = useRef(null);

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
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("memberNo");
        nav("/");
    };

    return (
        <div className="app">
            {!localStorage.getItem("loggedIn") && (<>
                <Topbar scrollToSection={scrollToSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            </>)}

            {localStorage.getItem("loggedIn") && (<>
                <TopbarProf menuOpen={menuOpen} setMenuOpen={setMenuOpen} loggedInUser={loggedInUser} memberNo={memberNo} />
            </>)}


            <div className="components">
                <Routes>
                    {/* {!localStorage.getItem("loggedIn") && (<> */}
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

                    {/* </>)} */}

                    <Route path={`/Profile/:memberNo`} element={<Profile />} />
                    <Route path="/Search" element={<Search />} />
                    <Route path="/Logout" element={<Logout onLogout={handleLogout} />} />

                </Routes>
            </div>
        </div>
    );
}

export default App;

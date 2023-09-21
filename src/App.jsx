import React, { useState, useRef } from "react"
import Topbar from "./components/Topbar/topbar.jsx"
import Intro from "./components/Intro/intro.jsx"
import Contact from "./components/Contact/contact.jsx"
import Event from "./components/Event/event.jsx"
import Footer from "./components/Footer/footer.jsx"
import History from "./components/History/history.jsx"
import Today from "./components/Today/today.jsx"
import Gallery from "./components/Gallery/gallery.jsx"
import Menu from "./components/Menu/menu.jsx"
import "./app.scss"



function App() {
  const [state, setState] = useState("Home");
  const [aboutState, setaboutState] = useState("history");
  const [menuOpen, setMenuOpen] = useState(false)
  
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <Topbar state={state} setState={setState} scrollToSection={scrollToSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu state={state} setState={setState} scrollToSection={scrollToSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      {state === "Home" && (
        <div className="homepage">
          <div className="introsection">
            <Intro />
          </div>
          <div className="eventsection">
            <Event />
          </div>
          <div className="contactsection" ref={sectionRef}>
            <Contact />
          </div>
          <Footer />
        </div>
      )}
      {state === "About" && (
        <div className="aboutus" >
          {aboutState === "history" && <History aboutState={aboutState} setaboutState={setaboutState} />}
          {aboutState === "today" && <Today aboutState={aboutState} setaboutState={setaboutState} />}
          <Footer />
        </div>
      )}
      {state === "Gallery" && (
        <div className="gallery" >
          <Gallery/>
          
        </div>
      )}



    </div>
  );
}

export default App;
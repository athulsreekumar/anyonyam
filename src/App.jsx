import React, { useState, useRef } from "react"
import Topbar from "./components/Topbar/topbar"
import Intro from "./components/Intro/intro"
import Contact from "./components/Contact/contact"
import Event from "./components/Event/event"
import Footer from "./components/Footer/footer"
import History from "./components/History/history"
import Today from "./components/Today/today"
import "./app.scss"



function App() {
  const [state, setState] = useState("Home");
  const [aboutState, setaboutState] = useState("history");
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <Topbar state={state} setState={setState} scrollToSection={scrollToSection} />
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



    </div>
  );
}

export default App;
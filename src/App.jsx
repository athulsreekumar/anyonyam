import React, { useState } from "react"
import Topbar from "./components/Topbar/topbar"
import Intro from "./components/Intro/intro"
import Contact from "./components/Contact/contact"
import Event from "./components/Event/event"
import Footer from "./components/Footer/footer"
import History from "./components/History/history"
import Today from "./components/Today/today"
import "./app.scss"



function App() {
  const [state, setState] = useState(false)
  return (
    <div className="app">
      <Topbar />
      {<div className="sections">
        <Intro/>

        <div className="eventsection">
            <Event/>
        </div>
        <Contact/>

        <div className="historysection">
            {/* <History/>
            <Today/> */}
        </div>

        <div className="footersection">
            <Footer/>
        </div>
        
        

      </div>}
    </div>
  );
}

export default App;
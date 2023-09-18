import React from "react"
import "./topbar.scss"

export default function Topbar( { state, setState , scrollToSection} ) {

    const handleButtonClick = () => {
        setState("Home");
        setTimeout(() => {
            scrollToSection();
          }, 100);
      };

    return (
        <div className="Topbar">
            <div className="wrapper">
                <div className="left">
                    <div className="icon">
                        <img src="assets/AnyonyamLogo.png" alt="" />
                    </div>
                    <div>
                        <a href="#intro" className="logo">
                            <img src="assets/logo.png" alt="img here" onClick={()=>setState(state="Home")}></img>
                        </a>
                    </div>
                </div>    
                <div className="center">
                    <span onClick={()=>setState(state="Home")}>Home</span>
                    <span onClick={()=>setState(state="About")}>About Us</span>
                    <span onClick={()=>setState(state="Gallery")}>Gallery</span>
                    <span onClick={handleButtonClick}>Contact Us</span>
                </div>
                
            </div>
        </div>
    )
}

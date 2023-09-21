import React from 'react'
import "./menu.scss"


export default function Menu( { state, setState, scrollToSection, menuOpen, setMenuOpen } ) {

    const handleButtonClick = () => {
        setState("Home");
        setTimeout(() => {
          scrollToSection();
        }, 100); // Close the menu on button click
      };


  return (
    <div className={"menu " + (menuOpen && "active")}>
        <ul>
            <li onClick={()=>setMenuOpen(false)}> 
                <span onClick={() => setState("Home")}><a href='#intro'>Home</a></span>
            </li>
            <li onClick={()=>setMenuOpen(false)}> 
                <span onClick={() => setState("About")}>About Us</span>
            </li>
            <li onClick={()=>setMenuOpen(false)}>
                <span onClick={() => setState("Gallery")}>Gallery</span>
            </li>
            <li onClick={()=>setMenuOpen(false)}>
               <span onClick={handleButtonClick}>Contact Us</span>
            </li>
        </ul>
    </div>
  )
}

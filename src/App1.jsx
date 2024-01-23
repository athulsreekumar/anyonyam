import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./profilecomponent/Profile/profile2.jsx";
import Search from "./profilecomponent/Search/search.jsx";
import Logout from "./profilecomponent/Logout/logout.jsx";
import "./app1.scss";
import Topbar from "./profilecomponent/Topbar/topbar.jsx";
import Login from "./components/Login/login4.jsx";

function App1({ loggedInUser }) {
  const [state, setState] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);


  const memberNo = loggedInUser.memberNo
  console.log(memberNo)


  return (

    <div className="app">
      <Topbar state={state} setState={setState} menuOpen={menuOpen} setMenuOpen={setMenuOpen} loggedInUser={loggedInUser} memberNo={memberNo} />
      <div className="dashboard">
        <Routes>
          
            <Route path={`/Profile/:memberNo`} element={<Profile />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/Logout' element={<Logout />} />
         
        </Routes>

        {/* {state === "Dashboard" && (
            <Profile/>
          )} */}
        {/* {state === "Search" && (
            <Search/>
        )} */}

      </div>

      {/* <Login/> */}

    </div>

  );
}

export default App1;

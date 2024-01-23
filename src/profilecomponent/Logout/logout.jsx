import "./logout.scss";
import React from "react";


export default function Logout({onLogout}) {

    onLogout();

    return (
        <div className="Logout">LOGGED OUT</div>
    );
}

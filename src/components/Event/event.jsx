import React from "react"
import "./event.scss"

export default function Event() {
  return (
    <div className="event" id="event">
        <div className="introtext">
            <p>Friendship and collaboration have thrived among the Namboothiris of Tripunithura, an idea that first sprouted at the Layam grounds over four centuries ago. Building connections between families has become a cherished tradition, marking its 25th anniversary as a flourishing community.</p>
        </div>
        <div className="picturearea" id="picturearea">
            
            <div className="pic1" id="pic1">
                <img src="assets/pic1.png" alt="" />
            </div>
            <div className="pic2" id="pic2">
                <img src="assets/pic2.png" alt="" />
            </div>
            <div className="pic3" id="pic3">
                <img src="assets/pic3.png" alt="" />
            </div>            
        </div>

        <div className="upcomingevent" id="upcomingevent">
            <p className="title" id="title">Upcoming Events:</p>
            <h2>ANYONYAM VARSHIKAM 2023</h2>
            <h3>23 Sepetember 2023</h3>
            <h3>5:00PM to 9:00PM</h3>
            <h3>Kalikota Palace, Tripunithura</h3>
        </div>
    </div>
  )
}

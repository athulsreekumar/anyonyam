import React from "react"
import "./event.scss"

export default function Event() {
  return (
    <div className="event" id="event">
        <div className="introtext">
            <p>
                <h2>Vision</h2>
            </p>
            <p>
            Develop and encourage friendship and cooperation among the members, preserve and maintain our rich Vedic culture, impart knowledge and training, and act as a change agent for the amendments that are necessitated by the passing of time.
            </p>
            <p>
                <h2>Mission</h2>
            </p>
            <p>
            Indulging in activities to hold the members together for a common cause, facilitating members to practice routine Vedic rituals, maintaining the highest ethical standards, and standing out in the public domain as a model organization in all the areas engaged in. 
            </p>
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
            <h2>25<sup>th</sup> ANYONYAM VARSHIKAM 2023</h2>
            <h3>23<sup>rd</sup> & 24<sup>th</sup> Sepetember 2023</h3>
            <h3>Muthukulangara Temple Auditorium</h3>
        </div>
    </div>
  )
}

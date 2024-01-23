import React from "react"
import "./today.scss"
import { Link } from "react-router-dom"

export default function Today() {
  return (
    <div className="today" id="today">
        <div className="heading" id="heading">
            <p>Our Story</p>
        </div>
        <div className="textheading" id="textheading">
            <div className="historytext" id="historytext">
                {/* <p onClick={()=>setaboutState(aboutState="history")}>History</p> */}
                <Link to="/About/History" style={{ textDecoration: 'none', color: 'white' }}> <p>History</p></Link>
            </div>
            <div className="todaytext" id="todaytext">
                {/* <p onClick={()=>setaboutState(aboutState="today")}>Anyonyam Today</p> */}
                <Link to="/About/Today" style={{ textDecoration: 'none', color: 'white' }}><p>Anyonyam Today</p></Link>
            </div>
        </div>


        <div className="todaycontent" id="todaycontent">

            <p> 
                After 25 years, the creativity of our members has undoubtedly propelled us forward through interactions, collaborations, and mentorships from previous leaders. We have established various committees, including the four-member committee, women's committee, youth committee, Salsanga Committee, Marriage Bureau, and Health Care Committee, among others, which have become integral parts of our organization.
            </p>
            <p>
                We have continually implemented progressive initiatives, offering economic support to economically disadvantaged members within our community and similar communities. We conduct various rituals, including pujas at Naalu Kettu, Ganapati homam, Bhagavatiseva, and Sukrita homam, to benefit our members.
            </p>
            <p>
                We take pride in nurturing a new generation of individuals who are passionate about advancing in their respective fields. We provide opportunities for expert-led friendly talks and classes, contributing to the development of our community. Our Thiruvathira team, 'Anyonyam Aathira,' has gained admiration throughout festival and other cultural activities.
            </p>
            <div className="imgContainer1">
                <img src="assets/Today1.png" alt="" />
            </div>

            <div className="imagePosition" id="imagePosition">
                <div className="textbox">
                    <p>
                        Empowering women entrepreneurs is a core focus of our women's committee, encouraging self-sufficiency among our female members. Our youth members have been instrumental in providing services, including blood donation drives, and organizing sports competitions such as the Annual Cricket Mela, Football Mela, and Badminton Mela, earning accolades across Kerala.
                    </p>
                    <p>
                        Our Marriage Bureau continues to help community members find compatible matches, while our Health Care Fund supports families facing financial difficulties. Our efforts include publishing member directories, maintaining accounts with modern systems like TALLY, and conducting educational camps for girls to learn daily rituals.
                    </p>
                </div>
                <div className="imagebox">
                    <img src="assets/Today2.png" alt="" />
                </div>
            </div>
            <p>We have always respected and honored members who excel in their fields, particularly in education, knowledge, and Vedic studies. Our organization places great importance on the community's elders and has consistently shown them respect.</p>
            <p>Over time, we have adapted to change while preserving our identity, remaining committed to our goals and aspirations. We call upon our members to embrace proactivity, offer creative suggestions, and guide innovative projects.</p>
            <p>We acknowledge the contributions of all those who have been part of our journey, including our mentors and leaders who have steered us in the right direction, even though it's not possible to mention every individual by name. We remember them all with deep respect and gratitude.</p>
        </div>
        
    </div>
  )
}

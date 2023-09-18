import React from "react"
import "./history.scss"

export default function History(  { aboutState, setaboutState }  ) {
  return (
    <div className="history" id="history">
       <div className="heading" id="heading">
            <p>Our Story</p>
       </div>
       <div className="textheading" id="textheading">
            <div className="historytext" id="historytext">
                <p onClick={()=>setaboutState(aboutState="history")}>History</p>
            </div>
            <div className="todaytext" id="todaytext">
                <p onClick={()=>setaboutState(aboutState="today")}>Anyonyam Today</p>
            </div>
        </div>

        <div className="historyContent" id="historyContent">

            <p>
            Anyonyam is an organization formed in 1998 to develop and encourage friendship and cooperation between the Namboodiri families in Tripunithura. Later it also took to its fold the responsibility of preserving our rich Vedic and cultural heritage by practicing and sharing the knowledge.  It has resulted in a network of more than 400 families as of now, on this occasion of Silver Jubilee Year in 2023. 

            </p>
            <p>
            The First General Body Meeting of Anyonyam was conducted in Kalikotta Palace on 15th August 1998. The conduct of cultural activities, sports events, and Annual Day celebrations resulted in better cohesion among the Anyonyam families. 
            After five years, Anyonyam has spread its activities in different fields to serve its members like – Health Care , Marriage Bureau, Scholarship and Endowments , Day Care Centre etc.
            It also started publishing a regular monthly journal to update its members about the happenings in the organization.
            </p>
            <p>The other activities of Anyonyam are as follows:</p>
            <p>
                <ol style={{ listStyleType: 'decimal' }}>
                    <li>&#8226; Conducting of seminars for members </li>
                    <li>&#8226; Sports activities</li>
                    <li>&#8226; Facilitating marriage proposals for members </li>
                    <li>&#8226; Publishing of journal with the Anyonyam news, literary contributions from members </li>
                    <li>&#8226; Spiritual Discourses, temple darshans </li>
                    <li>&#8226; Conducting of Health checkups, blood donation campaigns</li>
                    <li>&#8226; Helping aged members, providing medical/financial help in need</li>
                </ol>
            </p>
            <div className="imageposition" id="imageposition">
                <div className="textbox">
                    <p>
                    The realization that it is our responsibility to establish a permanent setup to facilitate the “ Shodasa Kriyas “ ( Choroonu, Upanayanam, Samavarthanam, Sradham, Pindam etc.) for the benefit of members, ended up buying a separate building (Nalukettu ) for such purposes. It was inaugurated by Bhagavathahamsam Sri Malliyoor Sankaran Namboodiri on 13th of July 2005 by delivering a divine speech. The Nalukettu is still remaining as our pride, providing service to people all over Kerala and outside.
                    </p>
                </div>
                <div className="imageContainer1" id=".imageContainer1">
                    <img src="assets/History1.png" alt="" />
                </div>

                

            </div>
            
            
            <p>
            We also conduct yearly residential Educational Seminars ( Padana Sibiram) for inculcating training to our new generation in the routine rituals to be followed. 
            Such conduct of Sibiram is also being done for females in imparting knowledge in the rituals , poojas etc. 
            Nalukettu is considered to be an abode providing members and others doing Shodasa Kriyas and also preserving and spreading the rich cultural heritage and Vedic knowledge. 

            </p>
            <p>
            We have separate Committees to take care of different activities of the organization- such as Nalukettu Samithi , Sathsanga Samithi, Vanitha Samithi, Yuvajana Samithi etc. 
            </p>

            <div className="imageposition2" id="imageposition2">
                
                <div className="image2" id="image2">
                    <img src="assets/History2.png" alt="" />
                </div>
                <div className="textbox">
                    <p>
                    Anyonyam recognizes the Vedic scholars by providing awards on a regular basis. It also provides scholarships to the deserving children of members to encourage their educational achievements.
                    </p>
                    <p>
                    Anyonyam gives a high level of respect and importance to the aged members and felicitates them on different occasions.
                    Going forward, Anyonyam aims to extend its activities by starting educational institutions, Auditoriums etc. to provide services to members and the general public. It is on its way to fulfilling its dreams.
                    </p>
                    <p>
                    Saluting and remembering the people who were instrumental in founding this priceless institution, we hope to reach new heights.
                    </p>
                </div>

            </div>

            


        </div>

    </div>
  )
}
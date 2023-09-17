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
                Looking back at the past is inevitable. On June 28, 1998, during a meeting at Thiruvathira Nalukettu, Mr. Maduramattam proposed the name "Anyonyam'' for the Namboothiri community, making it official. Sri Vadakkedam M S Mash served as the President, and Mr. P C N Namboothiri Nedumparambu led the first Executive Committee, which had its temporary headquarters at Subramanian Namboothiri's Pathayapura.
            </p>
            <p>
                On August 15, 1998, Anyonyam held its first public meeting at the ground. Puliannoor Diwakaran Namboothiripad and Alathur Narayanan Namboothiripad were the initial leaders of Anyonya
            </p>
            <div className="imageposition" id="imageposition">
                <div className="textbox">
                    <p>
                        Subsequently, bylaws were drafted, and the organisation was registered. The first successful family gathering emerged from the Thiruvathira festival in the month of Dhanu. This inspired the creation of the Thiruvathira Sangam, which excelled in various performances.
                    </p>
                </div>
                <div className="imageContainer1" id=".imageContainer1">
                    <img src="assets/History1.png" alt="" />
                </div>

                

            </div>
            
            
            <p>
                Over the years, Anyonyam organised Thiruvathira celebrations, arts, and sports competitions, fostering camaraderie among members. The organisation expanded its services, establishing a Health Care Committee, Marriage Bureau, Education Award Project, library, play school, mutual directory, and more.
            </p>
            <p>
                Members also secured a yoga space and office apartment. To facilitate posthumous cremations and burials, Tulu Brahmins worked tirelessly, with the support of the Brahmin congregation.


                Under the leadership of Sri Janardhanan Empranthiri, President of Brahmana Yuga, members effectively reached out to one another, implemented the "Anyonyam Patrika" newsletter, and offered timely assistance.
            </p>

            <div className="imageposition2" id="imageposition2">
                
                <div className="image2" id="image2">
                    <img src="assets/History2.png" alt="" />
                </div>
                <div className="textbox">
                    <p>
                        The origins and purposes of the organisation were rooted in providing members with suitable spaces for religious rituals, given limited flat and building space. This led to the formation of four knots within the community, chaired by Shri Panickam Appu Namboothiri for three years.
                    </p>
                    <p>
                        Shri Malliyur Sankaran's inauguration and blessing speech marked a significant milestone in 2005, and his dedication to the organisation remains a source of pride. The organisation continued to flourish, hosting a Nitya Karma study camp for boys in 2010, promoting the study of Shodasa Charas and the transmission of Brahmin traditions.
                    </p>
                    <p>
                        The Anyonyam community has grown into a reliable learning centre, supporting its members and celebrating its achievements.
                    </p>
                </div>

            </div>

            


        </div>

    </div>
  )
}
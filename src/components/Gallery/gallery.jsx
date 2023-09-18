import React,{useState} from "react"
import "./gallery.scss"



  

export default function Gallery() {

    const [state, setState] = useState("Varshikam");

  return (
    <div className="gallery" id="gallery">
        <div className="heading" id="heading">
            <p>Gallery</p>
            <div className="sections">
                <div className="left">
                    <p onClick={()=>setState("Varshikam")} className={state === "Varshikam" ? "active" : ""}>Varshikam</p>
                    <p onClick={()=>setState("PathanaShipiram")} className={state === "PathanaShipiram" ? "active" : ""}>Pathana Shipiram</p>
                    <p>Cricket Mela</p>
                    <p onClick={()=>setState("Football")} className={state === "Football" ? "active" : ""}>Football Mela</p>

                </div>
                <div className="right">
                    
                {state === "Varshikam" && (
                    <div className="imgContainer">

                    <img src="assets/Gallery/Varshikam/1.jpg" alt="hey" />
                    <img src="assets/Gallery/Varshikam/2.jpg" alt="hey" />
                    <img src="assets/Gallery/Varshikam/3.jpg" alt="hey" />
                    <img src="assets/Gallery/Varshikam/4.jpg" alt="hey" />
                    <img src="assets/Gallery/Varshikam/5.jpg" alt="hey" />
                    <img src="assets/Gallery/Varshikam/6.jpg" alt="hey" />
                </div>
                )}

                {state === "PathanaShipiram" && (
                    <div className="imgContainer">

                    <img src="assets/Gallery/PathanaShipiram/1.jpg" alt="hey" />
                    <img src="assets/Gallery/PathanaShipiram/2.jpg" alt="hey" />
                    <img src="assets/Gallery/PathanaShipiram/3.jpg" alt="hey" />
                    <img src="assets/Gallery/PathanaShipiram/4.jpg" alt="hey" />
                </div>
                )}

                {state === "Football" && (
                    <div className="imgContainer">

                    <img src="assets/Gallery/Football/1.jpg" alt="hey" />
                    <img src="assets/Gallery/Football/2.jpg" alt="hey" />
                    <img src="assets/Gallery/Football/3.jpg" alt="hey" />
                    <img src="assets/Gallery/Football/4.jpg" alt="hey" />
                    <img src="assets/Gallery/Football/5.jpg" alt="hey" />
                    <img src="assets/Gallery/Football/6.jpg" alt="hey" />
                </div>
                )}
                    

                    
                </div>
            </div>
       </div>
    </div>
  )
}

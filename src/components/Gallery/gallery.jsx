import React, { useState, useEffect } from "react"
import "./gallery.scss"

export default function Gallery() {

    const [state, setState] = useState("Varshikam");

    const [imagesFootball, setImagesFootball] = useState([]);
    const [imagesVarshikam, setImagesVarshikam] = useState([]);
    const [imagesPathanaShipiram, setImagesPathanaShipiram] = useState([]);

    useEffect(() => {
        // Dynamically import images from the "images" folder
        const importImages = () => {
            const imageContextFootball = require.context('../../../public/assets/Gallery/Football', false);
            const imagePathsFootball = imageContextFootball.keys().map(imageContextFootball);
            setImagesFootball(imagePathsFootball);

            const imageContextPathanaShipiram = require.context('../../../public/assets/Gallery/PathanaShipiram', false);
            const imagePathsPathanaShipiram = imageContextPathanaShipiram.keys().map(imageContextPathanaShipiram);
            setImagesPathanaShipiram(imagePathsPathanaShipiram);

            const imageContextVarshikam = require.context('../../../public/assets/Gallery/Varshikam', false);
            const imagePathsVarshikam = imageContextVarshikam.keys().map(imageContextVarshikam);
            setImagesVarshikam(imagePathsVarshikam);
        };

        importImages();
    }, []);

    return (

        <div className="gallery">
            <div className="heading">
                <p>Gallery</p>
            </div>
            <div className="sections">

                <div className="left">
                    <p onClick={() => setState("Varshikam")} className={state === "Varshikam" ? "active" : ""}>Varshikam</p>
                    <p onClick={() => setState("PathanaShipiram")} className={state === "PathanaShipiram" ? "active" : ""}>Patana Shibiram</p>
                    <p>Cricket Mela</p>
                    <p onClick={() => setState("Football")} className={state === "Football" ? "active" : ""}>Football Mela</p>
                </div>
                <div className="right">
                    <div className="scroll">

                    
                        {state === "Varshikam" && (
                            <div className="imgContainer">
                                {
                                    imagesVarshikam.map((image, index) => (
                                        <img key={index} src={image} alt={`${index}`} />
                                    ))
                                }
                            </div>
                        )}
                        {state === "PathanaShipiram" && (
                            <div className="imgContainer">
                                {
                                    imagesPathanaShipiram.map((image, index) => (
                                        <img key={index} src={image} alt={`${index}`} />
                                    ))
                                }
                            </div>
                        )}
                        {state === "Football" && (
                            <div className="imgContainer">
                                {
                                    imagesFootball.map((image, index) => (
                                        <img key={index} src={image} alt={`${index}`} />
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
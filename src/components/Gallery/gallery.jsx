import React, { useState, useEffect } from "react"
import "./gallery.scss"

const CATEGORIES = [
    { key: "Varshikam", label: "Varshikam" },
    { key: "PathanaShipiram", label: "Patana Shibiram" },
    { key: "Football", label: "Football Mela" },
];

export default function Gallery() {
    const [active, setActive] = useState("Varshikam");
    const [manifest, setManifest] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/assets/Gallery/manifest.json')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(setManifest)
            .catch(() => setError(true));
    }, []);

    const images = manifest[active] || [];

    return (
        <div className="gallery">
            <div className="heading">
                <p>Gallery</p>
            </div>
            <div className="sections">
                <div className="left">
                    {CATEGORIES.map(({ key, label }) => (
                        <p
                            key={key}
                            onClick={() => setActive(key)}
                            className={active === key ? "active" : ""}
                        >
                            {label}
                        </p>
                    ))}
                    <p className="disabled">Cricket Mela</p>
                </div>
                <div className="right">
                    <div className="scroll">
                        {error && <p className="galleryError">Couldn't load photos right now.</p>}
                        {!error && images.length === 0 && <p className="galleryEmpty">Loading…</p>}
                        <div className="imgContainer">
                            {images.map((src) => (
                                <img key={src} src={src} alt={`${active} event`} loading="lazy" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import '../styles/GeneratedImages.css';

const GeneratedImages = ({ images }) => {
    const [generatedImages, setGeneratedImages] = useState([]);

    useEffect(() => {
        if (images && images.length > 0) {
            setGeneratedImages(images);
        }
    }, [images]);

    return (
        <div className="generated-images">
            {generatedImages.length > 0 ? (
                <div className="image-grid">
                    {generatedImages.map((image, index) => (
                        <img key={index} src={`http://localhost:8000/generated/${image}`} alt={`Generated ${index}`} />
                    ))}
                </div>
            ) : (
                <p>No images generated yet.</p>
            )}
        </div>
    );
};

export default GeneratedImages;

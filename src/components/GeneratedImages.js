import React, { useState, useEffect } from 'react';
import { getStaticUrl } from '../api';
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
            <h2>生成素材圖片</h2>
            {generatedImages.length > 0 ? (
                <div className="image-grid">
                    {generatedImages.map((image, index) => (
                        <img key={index} src={getStaticUrl(image)} alt={`Generated ${index}`} />
                    ))}
                </div>
            ) : (
                <p>No images generated yet.</p>
            )}
        </div>
    );
};

export default GeneratedImages;

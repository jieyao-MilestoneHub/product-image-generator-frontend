import React, { useState, useEffect } from 'react';
import { getStaticUrl } from '../api';
import '../styles/GeneratedItem.css';

const GeneratedImages = ({ images, audience, shortText, longText }) => {
    const [generatedImages, setGeneratedImages] = useState([]);

    useEffect(() => {
        if (images && images.length > 0) {
            console.log("Images received in GeneratedImages:", images);
            setGeneratedImages(images);
        }
    }, [images]);

    // Log generatedImages for debugging
    console.log('generatedImages:', generatedImages);

    return (
        <div className="generated-images">
            <h2>生成素材圖片</h2>
            {generatedImages.length > 0 ? (
                <>
                    <div className="image-grid">
                        {generatedImages.map((item, index) => (
                            <div key={index} className="image-item">
                                <img src={getStaticUrl(item.imageUrl)} alt={`Generated ${index}`} />
                            </div>
                        ))}
                    </div>
                    <div className="text-content">
                        <p><strong>受眾:</strong> {audience}</p>
                        <p><strong>短文本:</strong></p>
                        <p>{shortText}</p>
                        <p><strong>長文本:</strong></p>
                        <p>{longText}</p>
                    </div>
                </>
            ) : (
                <p>尚未生成圖片。</p>
            )}
        </div>
    );
};

export default GeneratedImages;

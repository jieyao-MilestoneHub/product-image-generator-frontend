import React, { useState, useEffect } from 'react';
import { getStaticUrl } from '../api';
import '../styles/GeneratedItem.css';

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
                    {generatedImages.map((item, index) => (
                        <div key={index} className="image-item">
                            <img src={getStaticUrl(item.imageUrl)} alt={`Generated ${index}`} />
                            <div className="text-content">
                                <p><strong>受眾:</strong> {item.audienceType}</p>
                                <p><strong>短文本:</strong></p>
                                <p>{item.shortText}</p>
                                <p><strong>長文本:</strong></p>
                                <p>{item.longText}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>尚未生成圖片。</p>
            )}
        </div>
    );
};

export default GeneratedImages;

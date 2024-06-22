import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import GeneratedImages from './GeneratedImages';
import '../styles/MainContent.css';

const MainContent = ({ project }) => {
    const [images, setImages] = useState([]);

    const handleImagesGenerated = (newImages) => {
        setImages(newImages);
    };

    return (
        <div className="main-content">
            <div className="section">
                <div className="form-section">
                    <ProjectForm onImagesGenerated={handleImagesGenerated} project={project} />
                </div>
                <div className="divider"></div>
                <div className="generated-images-section">
                    <h2>生成的產品圖 ({project})</h2>
                    <GeneratedImages images={images} />
                </div>
            </div>
        </div>
    );
};

export default MainContent;

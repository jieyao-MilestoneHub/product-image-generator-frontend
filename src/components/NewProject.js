import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import GeneratedImages from './GeneratedImages';
import Footer from './Footer';
import '../styles/NewProject.css';

const NewProject = ({ project }) => {
    const [images, setImages] = useState([]);

    const handleImagesGenerated = (newImages) => {
        console.log('handleImagesGenerated called with:', newImages); // 日誌
        setImages(newImages);
    };

    return (
        <div className="new-project">
            <div className="project-form-container">
                <ProjectForm onImagesGenerated={handleImagesGenerated} />
            </div>
            <div className="generated-images-container">
                <GeneratedImages images={images} />
            </div>
            <Footer />
        </div>
    );
};

export default NewProject;

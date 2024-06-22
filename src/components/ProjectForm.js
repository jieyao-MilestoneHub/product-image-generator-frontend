import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/ProjectForm.css';

const ProjectForm = ({ onImagesGenerated }) => {
    const [projectName, setProjectName] = useState('');
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [uploadedImageFilename, setUploadedImageFilename] = useState('');
    const [targetOptions, setTargetOptions] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchTargetOptions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/target-audiences');
                setTargetOptions(response.data);
            } catch (error) {
                console.error("There was an error fetching target audiences!", error);
            }
        };
        fetchTargetOptions();
    }, []);

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        setProductImage(imageFile);

        const formData = new FormData();
        formData.append('product_image', imageFile);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadedImageFilename(response.data.filename);
        } catch (error) {
            console.error("There was an error uploading the image!", error);
        }
    };

    const handleSubmit = async () => {
        if (!projectName || selectedAudiences.length === 0 || !uploadedImageFilename) {
            alert("所有資訊都是必填/選的！");
            return;
        }

        const formData = new FormData();
        formData.append('project_name', projectName);
        formData.append('target_audience', selectedAudiences.join(','));
        formData.append('product_image_filename', uploadedImageFilename);

        console.log("Submitting form data:");
        console.log("Project Name:", projectName);
        console.log("Target Audiences:", selectedAudiences.join(','));
        console.log("Product Image Filename:", uploadedImageFilename);

        try {
            const response = await axios.post('http://localhost:8000/api/generate-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onImagesGenerated(response.data.generated_images);
        } catch (error) {
            console.error("There was an error generating the images!", error);
        }
    };

    const handleTargetAudienceChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedAudiences.includes(selectedValue)) {
            setSelectedAudiences([...selectedAudiences, selectedValue]);
        }
    };

    const removeTargetAudience = (target) => {
        setSelectedAudiences(selectedAudiences.filter(audience => audience !== target));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="project-form">
            <h2>專案名稱 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="輸入專案名稱" 
                required
            />
            <h2>投放定向 <span className="required">*</span></h2>
            <select onChange={handleTargetAudienceChange} required>
                <option value="">選擇投放定向</option>
                {Object.entries(targetOptions).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                ))}
            </select>
            <div className="selected-audiences">
                {selectedAudiences.map((audience, index) => (
                    <div key={index} className="selected-audience">
                        {audience}
                        <button type="button" onClick={() => removeTargetAudience(audience)}>&times;</button>
                    </div>
                ))}
            </div>
            <h2>產品去背圖 <span className="required">*</span></h2>
            <button type="button" onClick={handleImageClick} className="upload-button">選擇圖片</button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
                required
            />
            {productImage && <img src={URL.createObjectURL(productImage)} alt="Product" className="product-image" />}
            <button onClick={handleSubmit} className="submit-button">生成圖片</button>
        </div>
    );
};

export default ProjectForm;

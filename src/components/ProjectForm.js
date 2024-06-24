import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchTargetOptions, uploadImage, generateImages } from '../api';
import '../styles/ProjectForm.css';

const ProjectForm = ({ onImagesGenerated, formData, onFormDataChange }) => {
    const [projectName, setProjectName] = useState(formData.projectName || '');
    const [projectDescribe, setProjectDescribe] = useState(formData.projectDescribe || '');
    const [selectedAudiences, setSelectedAudiences] = useState(formData.selectedAudiences || []);
    const [productImage, setProductImage] = useState(formData.productImage || null);
    const [uploadedImageFilename, setUploadedImageFilename] = useState(formData.uploadedImageFilename || '');
    const [timestamp, setTimestamp] = useState(formData.timestamp || '');
    const [targetOptions, setTargetOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getTargetOptions = async () => {
            try {
                const data = await fetchTargetOptions();
                setTargetOptions(data);
            } catch (error) {
                setError("無法獲取目標受眾資料。");
            }
        };
        getTargetOptions();
    }, []);

    useEffect(() => {
        onFormDataChange({
            projectName,
            projectDescribe,
            selectedAudiences,
            productImage,
            uploadedImageFilename,
            timestamp
        });
    }, [projectName, projectDescribe, selectedAudiences, productImage, uploadedImageFilename, timestamp, onFormDataChange]);

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        setProductImage(imageFile);

        setIsLoading(true);
        try {
            const response = await uploadImage(imageFile);
            console.log('Image upload response:', response);
            setUploadedImageFilename(response.filename);
            setTimestamp(response.timestamp);
        } catch (error) {
            setError("上傳圖片失敗。");
        }
        setIsLoading(false);
    };

    const handleSubmit = async () => {
        console.log('Submitting form with:', { projectName, projectDescribe, selectedAudiences, uploadedImageFilename, timestamp });
        if (!projectName || !projectDescribe || selectedAudiences.length === 0 || !uploadedImageFilename || !timestamp) {
            alert("所有資訊都是必填/選的！");
            return;
        }

        setIsLoading(true);
        try {
            const generatedImages = await generateImages(projectName, projectDescribe, selectedAudiences, uploadedImageFilename, timestamp);
            if (typeof onImagesGenerated === 'function') {
                onImagesGenerated(generatedImages);
            } else {
                setError("內部錯誤：圖片生成回調不是函數。");
            }
        } catch (error) {
            setError("生成圖片過程中發生錯誤。");
        }
        setIsLoading(false);
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
            <h2>產品名稱 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="輸入產品名稱" 
                required
            />
            <h2>產品描述 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={projectDescribe} 
                onChange={(e) => setProjectDescribe(e.target.value)} 
                placeholder="輸入產品描述"
                required
            />
            <h2>投放定向 <span className="required">*</span></h2>
            <div className="select-wrapper">
                <select onChange={handleTargetAudienceChange} required>
                    <option value="">選擇投放定向</option>
                    {Object.entries(targetOptions).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            <div className="selected-audiences-container">
                <div className="selected-audiences">
                    {selectedAudiences.map((audience, index) => (
                        <div key={index} className="selected-audience">
                            <span className="audience-text">{audience}</span>
                            <button type="button" onClick={() => removeTargetAudience(audience)}>&times;</button>
                        </div>
                    ))}
                </div>
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
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

ProjectForm.propTypes = {
    onImagesGenerated: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onFormDataChange: PropTypes.func.isRequired,
};

export default ProjectForm;

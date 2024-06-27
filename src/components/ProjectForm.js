import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchTargetOptions, uploadImage, generateProduct } from '../api';
import '../styles/ProductForm.css';

const ProductForm = ({ onImagesGenerated, formData, onFormDataChange }) => {
    const [productName, setProductName] = useState(formData.productName || '');
    const [productDescribe, setProductDescribe] = useState(formData.productDescribe || '');
    const [selectedAudiences, setSelectedAudiences] = useState(formData.selectedAudiences || {
        gender: '',
        age: '',
        occupation: '',
        interest: ''
    });
    const [productImage, setProductImage] = useState(formData.productImage || null);
    const [uploadedImageFilename, setUploadedImageFilename] = useState(formData.uploadedImageFilename || '');
    const [timestamp, setTimestamp] = useState(formData.timestamp || '');
    const [targetOptions, setTargetOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitCount, setSubmitCount] = useState(0);
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
            productName,
            productDescribe,
            selectedAudiences,
            productImage,
            uploadedImageFilename,
            timestamp
        });
    }, [productName, productDescribe, selectedAudiences, productImage, uploadedImageFilename, timestamp, onFormDataChange]);

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
        if (submitCount > 0) {
            alert("您已經提交過一次了，不能再次提交。");
            return;
        }

        console.log('Submitting form with:', { productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp });
        if (!productName || !productDescribe || Object.values(selectedAudiences).includes('') || !uploadedImageFilename || !timestamp) {
            alert("所有資訊都是必填/選的！");
            return;
        }

        setIsLoading(true);
        try {
            const generatedResults = await generateProduct(productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp);
            if (typeof onImagesGenerated === 'function') {
                onImagesGenerated(generatedResults);
            } else {
                setError("內部錯誤：圖片生成回調不是函數。");
            }
            setSubmitCount(submitCount + 1); // 增加提交计数
        } catch (error) {
            setError("生成項目過程中發生錯誤。");
        }
        setIsLoading(false);
    };

    const handleTargetAudienceChange = (e, category) => {
        const selectedValue = e.target.value;
        setSelectedAudiences(prevState => ({
            ...prevState,
            [category]: selectedValue
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="project-form">
            <h2>產品名稱 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                placeholder="輸入產品名稱" 
                required
            />
            <h2>產品描述 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={productDescribe} 
                onChange={(e) => setProductDescribe(e.target.value)} 
                placeholder="輸入產品描述"
                required
            />
            <h2>投放定向 <span className="required">*</span></h2>
            <div className="select-wrapper">
                <h3>性別</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'gender')} value={selectedAudiences.gender} required>
                    <option value="">選擇性別</option>
                    {Object.entries(targetOptions.gender || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <h3>年齡</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'age')} value={selectedAudiences.age} required>
                    <option value="">選擇年齡</option>
                    {Object.entries(targetOptions.age || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <h3>職業</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'occupation')} value={selectedAudiences.occupation} required>
                    <option value="">選擇職業</option>
                    {Object.entries(targetOptions.occupation || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <h3>興趣</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'interest')} value={selectedAudiences.interest} required>
                    <option value="">選擇興趣</option>
                    {Object.entries(targetOptions.interest || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
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
            <button onClick={handleSubmit} className="submit-button">生成圖片與文案</button>
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

ProductForm.propTypes = {
    onImagesGenerated: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onFormDataChange: PropTypes.func.isRequired,
};

export default ProductForm;

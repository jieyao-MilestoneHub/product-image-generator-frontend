import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchTargetOptions, uploadImage, generateProduct } from '../api';
import '../styles/ProductForm.css';

const ProductForm = ({ 
    onImagesGenerated, 
    formData, 
    onFormDataChange, 
    isLoading, 
    onLoadingChange, 
    onErrorChange, 
    onImageUpload, 
    uploadedImageFilename, 
    timestamp, 
    error,
    onProductImageChange
}) => {
    const [productName, setProductName] = useState(formData.productName || '');
    const [productDescribe, setProductDescribe] = useState(formData.productDescribe || '');
    const [selectedAudiences, setSelectedAudiences] = useState(formData.selectedAudiences || {
        gender: '',
        age: '',
        interest: ''
    });
    const [productImage, setProductImage] = useState(formData.productImage || null);
    const [targetOptions, setTargetOptions] = useState({});
    const [submitCount, setSubmitCount] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [imageSelected, setImageSelected] = useState(false); // 標記圖片是否已按下上傳
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getTargetOptions = async () => {
            try {
                const data = await fetchTargetOptions();
                setTargetOptions(data);
            } catch (error) {
                onErrorChange("無法獲取目標受眾資料。");
            }
        };
        getTargetOptions();
    }, [onErrorChange]);

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
        setImageSelected(true); // 標記圖片已選擇
        onProductImageChange(URL.createObjectURL(imageFile)); // 回調，傳遞 image 路徑

        onLoadingChange(true);
        try {
            const response = await uploadImage(imageFile);
            console.log('Image upload response:', response);
            onImageUpload(response.filename, response.timestamp);
        } catch (error) {
            onErrorChange("上傳圖片失敗。");
        }
        onLoadingChange(false);
    };

    const handleSubmit = async () => {
        if (submitCount > 0) {
            alert("您已經提交過一次了，不能再次提交。");
            return;
        }

        console.log('Submitting form with:', { productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp });
        if (!productName || !productDescribe || Object.values(selectedAudiences).includes('') || !uploadedImageFilename || !timestamp) {
            alert("檢查是否所有資訊都填完，或請稍等圖片前處理...");
            return;
        }

        onLoadingChange(true);
        setIsButtonDisabled(true); // 禁用按鈕
        try {
            const generatedResults = await generateProduct(productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp);
            if (typeof onImagesGenerated === 'function') {
                onImagesGenerated(generatedResults, productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp);
            } else {
                onErrorChange("內部錯誤：圖片生成回調不是函數。");
            }
            setSubmitCount(submitCount + 1); // 增加提交次數
        } catch (error) {
            onErrorChange("生成項目過程中發生錯誤。");
            setIsButtonDisabled(false); // 發生錯誤時重新啟動按鈕
        }
        onLoadingChange(false);
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
                disabled={!imageSelected} // 選取圖片前禁用
            />
            <h2>產品描述 <span className="required">*</span></h2>
            <input 
                type="text" 
                value={productDescribe} 
                onChange={(e) => setProductDescribe(e.target.value)} 
                placeholder="輸入產品描述"
                required
                disabled={!imageSelected} // 選取圖片前禁用
            />
            <h2>投放定向 <span className="required">*</span></h2>
            <div className="select-wrapper">
                <h3>性別</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'gender')} value={selectedAudiences.gender} required disabled={!imageSelected}>
                    <option value="">選擇性別</option>
                    {Object.entries(targetOptions.gender || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <h3>年齡</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'age')} value={selectedAudiences.age} required disabled={!imageSelected}>
                    <option value="">選擇年齡</option>
                    {Object.entries(targetOptions.age || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <h3>興趣</h3>
                <select onChange={(e) => handleTargetAudienceChange(e, 'interest')} value={selectedAudiences.interest} required disabled={!imageSelected}>
                    <option value="">選擇興趣</option>
                    {Object.entries(targetOptions.interest || {}).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            {!imageSelected && <p className="image-upload-reminder">請先上傳圖片</p>}
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
            <div className="button-container">
                <button onClick={handleSubmit} className="submit-button" disabled={isButtonDisabled || !imageSelected}>生成圖片與文案</button>
            </div>
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

ProductForm.propTypes = {
    onImagesGenerated: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onFormDataChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onLoadingChange: PropTypes.func.isRequired,
    onErrorChange: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    uploadedImageFilename: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    onProductImageChange: PropTypes.func.isRequired
};

export default ProductForm;

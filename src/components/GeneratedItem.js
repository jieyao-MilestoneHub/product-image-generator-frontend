import React, { useState, useEffect } from 'react';
import { getStaticUrl, generateProduct } from '../api';
import '../styles/GeneratedItem.css';
import Modal from 'react-modal';

// 自定義樣式用於模態框
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const GeneratedImages = ({ images, productName, productDescribe, selectedAudiences, shortText, longText, uploadedImageFilename, timestamp }) => {
    const [generatedImages, setGeneratedImages] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shortTextState, setShortTextState] = useState(shortText);
    const [longTextState, setLongTextState] = useState(longText);

    const imageSizes = ['300x250', '320x480', '970x250']; // 尺寸標籤

    useEffect(() => {
        if (images && images.length > 0) {
            console.log("Images received in GeneratedImages:", images);
            setGeneratedImages(images.map(img => ({
                imageUrl: getStaticUrl(img.imageUrl) // 確保路徑被正確處理
            })));
        }
    }, [images]);

    const openModal = (imageUrl) => {
        setSelectedImage(getStaticUrl(imageUrl));
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedImage(null);
    };

    const regenerateImages = async () => {
        setIsLoading(true);
        setError('');
        try {
            const newImages = await generateProduct(productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp);
            console.log("New Images:", newImages);
            // 確保從後端返回的圖片 URL 被正確處理並設置到狀態中
            setGeneratedImages(newImages.generated_images.map(img => ({
                imageUrl: getStaticUrl(img) // 將後端返回的路徑轉換為靜態URL
            })));
            setShortTextState(newImages.short_ad);
            setLongTextState(newImages.long_ad);
        } catch (error) {
            setError("生成新圖片時出錯。");
        }
        setIsLoading(false);
    };

    return (
        <div className="generated-images">
            <h2>生成素材圖片</h2>
            <button onClick={regenerateImages} disabled={isLoading}>重新生成</button>
            {isLoading && <p className="loading">加載中...</p>}
            {error && <p className="error">{error}</p>}
            {generatedImages.length > 0 ? (
                <>
                    <div className="image-grid">
                        <div className="image-item" onClick={() => openModal(uploadedImageFilename)}>
                            <img src={getStaticUrl(uploadedImageFilename)} alt="Generated 0" />
                            <div className="image-label">產品去背圖</div>
                        </div>
                    </div>
                    <div className="image-scroll-container">
                        {generatedImages.slice(0, 3).map((item, index) => (
                            <div key={index} className="image-item" onClick={() => openModal(item.imageUrl)}>
                                <img src={item.imageUrl} alt={`Generated ${index + 1}`} />
                                <div className="image-label">{imageSizes[index] || '未知尺寸'}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-content">
                        <p><strong>產品名稱:</strong> {productName}</p>
                        <p><strong>產品描述:</strong> {productDescribe}</p>
                        <p><strong>受眾:</strong> {selectedAudiences.gender}, {selectedAudiences.age}, {selectedAudiences.interest}</p>
                        <p><strong>短文本:</strong> {shortTextState}</p>
                        <p><strong>長文本:</strong> {longTextState}</p>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Image Modal"
                    >
                        <button onClick={closeModal} className="close-button">關閉</button>
                        {selectedImage && <img src={selectedImage} alt="Selected" className="modal-image" />}
                    </Modal>
                </>
            ) : (
                <p>尚未生成圖片。</p>
            )}
        </div>
    );
};

export default GeneratedImages;

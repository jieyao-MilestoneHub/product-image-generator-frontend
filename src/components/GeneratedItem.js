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

const GeneratedImages = ({ images, product_name, product_description, audience, shortText, longText, productImageFilename, timestamp }) => {
    const [generatedImages, setGeneratedImages] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shortTextState, setShortTextState] = useState(shortText);
    const [longTextState, setLongTextState] = useState(longText);

    useEffect(() => {
        if (images && images.length > 0) {
            console.log("Images received in GeneratedImages:", images);
            setGeneratedImages(images);
        }
    }, [images]);

    // Log generatedImages for debugging
    console.log('generatedImages:', generatedImages);

    const imageSizes = ['300x250', '320x480', '970x250']; // 尺寸標籤

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
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
            const newImages = await generateProduct(product_name, product_description, audience, productImageFilename, timestamp);
            setGeneratedImages(newImages.generated_images);
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
                        <div className="image-item" onClick={() => openModal(generatedImages[0].imageUrl)}>
                            <img src={getStaticUrl(generatedImages[0].imageUrl)} alt={`Generated 0`} />
                            <div className="image-label">產品去背圖</div>
                        </div>
                        {generatedImages.slice(1, 4).map((item, index) => (
                            <div key={index + 1} className="image-item" onClick={() => openModal(item.imageUrl)}>
                                <img src={getStaticUrl(item.imageUrl)} alt={`Generated ${index + 1}`} />
                                <div className="image-label">{imageSizes[index] || '未知尺寸'}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-content">
                        <p><strong>產品名稱:</strong> {product_name}</p>
                        <p><strong>產品描述:</strong> {product_description}</p>
                        <p><strong>受眾:</strong> {audience}</p>
                        <p><strong>短文本:</strong></p>
                        <p>{shortTextState}</p>
                        <p><strong>長文本:</strong></p>
                        <p>{longTextState}</p>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Image Modal"
                    >
                        <button onClick={closeModal} className="close-button">關閉</button>
                        {selectedImage && <img src={getStaticUrl(selectedImage)} alt="Selected" className="modal-image" />}
                    </Modal>
                </>
            ) : (
                <p>尚未生成圖片。</p>
            )}
        </div>
    );
};

export default GeneratedImages;

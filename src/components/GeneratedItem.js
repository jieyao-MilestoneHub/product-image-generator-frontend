// GeneratedItem.js
import React, { useState, useEffect } from 'react';
import { generateProduct } from '../api';
import '../styles/GeneratedItem.css';
import Modal from 'react-modal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import getConfig from './../config';

const { staticDomain } = getConfig();

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

const GeneratedImages = ({ images, productName, productDescribe, selectedAudiences, shortText, longText, uploadedImageFilename, timestamp, isGenerating }) => {
    const [generatedImages, setGeneratedImages] = useState(() => {
        const savedImages = localStorage.getItem('generatedImages');
        return savedImages ? JSON.parse(savedImages) : [];
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shortTextState, setShortTextState] = useState(() => localStorage.getItem('shortTextState') || shortText);
    const [longTextState, setLongTextState] = useState(() => localStorage.getItem('longTextState') || longText);

    const imageSizes = ['300x250', '320x480', '336x280']; // Size labels

    useEffect(() => {
        if (images && images.length > 0) {
            console.log("Images received in GeneratedImages:", images);
            const newImages = images.map(img => ({
                imageUrl: `${staticDomain}/${img.imageUrl}` // 添加 'static/' 前缀
            }));
            setGeneratedImages(newImages);
            localStorage.setItem('generatedImages', JSON.stringify(newImages));
        }
    }, [images]);

    useEffect(() => {
        localStorage.setItem('shortTextState', shortTextState);
        localStorage.setItem('longTextState', longTextState);
    }, [shortTextState, longTextState]);

    const cleanImageUrl = (url) => {
        const basePath = `${staticDomain}/static/`;
        if (url.startsWith(basePath)) {
            return url.substring(basePath.length);
        }
        return url;
    };

    const openModal = (imageUrl) => {
        console.log(imageUrl);
        if (imageUrl.includes('http')) {
            setSelectedImage(cleanImageUrl(`${staticDomain}/${imageUrl}`));
        } else {
            setSelectedImage(`${staticDomain}/${imageUrl}`);
        }
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
            // Ensure image URLs returned from the backend are properly handled and set to state
            const newGeneratedImages = newImages.generated_images.map(img => ({
                imageUrl: `${staticDomain}/${img}` // 添加 'static/' 前缀
            }));
            setGeneratedImages(newGeneratedImages);
            localStorage.setItem('generatedImages', JSON.stringify(newGeneratedImages));
            console.log(generatedImages);
            setShortTextState(newImages.short_ad);
            setLongTextState(newImages.long_ad);
        } catch (error) {
            setError("Error generating new images.");
        }
        setIsLoading(false);
    };

    const downloadZip = async () => {
        if (generatedImages.length === 0 && !uploadedImageFilename) {
            setError('No data available for download.');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder(`generated_content_${timestamp}`);

        // Add images to the folder within the zip
        const imagePromises = generatedImages.map(async (item, index) => {
            const response = await fetch(item.imageUrl);
            const blob = await response.blob();
            folder.file(`generated_image_${index + 1}.jpg`, blob);
        });

        if (uploadedImageFilename) {
            const uploadedImageResponse = await fetch(`${staticDomain}/${uploadedImageFilename}`);
            const uploadedImageBlob = await uploadedImageResponse.blob();
            folder.file('uploaded_image.jpg', uploadedImageBlob);
        }

        // Add texts to the folder within the zip
        const textContent = `
Product Name: ${productName}
Product Description: ${productDescribe}
Audience: ${selectedAudiences.gender}, ${selectedAudiences.age}, ${selectedAudiences.interest}
Short Text: ${shortTextState}
Long Text: ${longTextState}
        `;
        folder.file('content.txt', textContent);

        await Promise.all(imagePromises);

        // Generate and download the zip file
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `generated_content_${timestamp}.zip`);
        });
    };

    return (
        <div className="generated-images">
            <h2>生成素材圖片</h2>
            <button onClick={regenerateImages} disabled={isLoading || isGenerating}>重新生成</button>
            <button onClick={downloadZip} disabled={(generatedImages.length === 0 && !uploadedImageFilename) || isGenerating}>下載所有內容</button>
            {isLoading && <p className="loading">加載中...</p>}
            {error && <p className="error">{error}</p>}
            {generatedImages.length > 0 ? (
                <>
                    <div className="image-grid">
                        <div className="image-item" onClick={() => openModal(uploadedImageFilename)}>
                            <img src={`${staticDomain}/${uploadedImageFilename}`} alt="Generated 0" />
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

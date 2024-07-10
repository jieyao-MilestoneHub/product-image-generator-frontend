import React, { useState, useEffect } from 'react';
import { getStaticUrl, generateProduct } from '../api';
import '../styles/GeneratedItem.css';
import Modal from 'react-modal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Custom styles for the modal
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

    const imageSizes = ['300x250', '320x480', '336x280']; // Size labels

    useEffect(() => {
        if (images && images.length > 0) {
            console.log("Images received in GeneratedImages:", images);
            setGeneratedImages(images.map(img => ({
                imageUrl: getStaticUrl(img.imageUrl) // Ensure path is properly handled
            })));
        }
    }, [images]);

    const cleanImageUrl = (url) => {
        const basePath = 'http://localhost:8000/static/';
        if (url.startsWith(basePath)) {
            return url.substring(basePath.length);
        }
        return url;
    };

    const openModal = (imageUrl) => {
        console.log(imageUrl);
        if (imageUrl.includes('http')) {
            setSelectedImage(cleanImageUrl(getStaticUrl(imageUrl)));
        } else {
            setSelectedImage(getStaticUrl(imageUrl));
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
            setGeneratedImages(newImages.generated_images.map(img => ({
                imageUrl: getStaticUrl(img) // Convert backend paths to static URLs
            })));
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
            const uploadedImageResponse = await fetch(getStaticUrl(uploadedImageFilename));
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
            <button onClick={regenerateImages} disabled={isLoading}>重新生成</button>
            <button onClick={downloadZip} disabled={generatedImages.length === 0 && !uploadedImageFilename}>下載所有內容</button>
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

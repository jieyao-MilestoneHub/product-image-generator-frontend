import axios from 'axios';
import getConfig from './config';

const { apiDomain, staticDomain } = getConfig();

export const fetchTargetOptions = async () => {
    try {
        const response = await axios.get(`${apiDomain}/api/target-audiences`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching target audiences');
    }
};

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('product_image', imageFile);

    try {
        const response = await axios.post(`${apiDomain}/api/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.filename;
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

export const generateImages = async (projectName, selectedAudiences, uploadedImageFilename) => {
    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('target_audience', selectedAudiences.join(','));
    formData.append('product_image_filename', uploadedImageFilename);

    try {
        const response = await axios.post(`${apiDomain}/api/generate-images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.generated_images;
    } catch (error) {
        throw new Error('Error generating images');
    }
};

export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${apiDomain}/api/history`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching history data');
    }
};

export const getStaticUrl = (path) => `${staticDomain}/${path}`;

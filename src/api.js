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
        return response.data; // 确保返回的数据包含 filename 和 timestamp
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

export const generateImages = async (projectName, projectDescribe, selectedAudiences, uploadedImageFilename, timestamp) => {
    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('project_describe', projectDescribe);
    formData.append('target_audience', selectedAudiences.join(','));
    formData.append('product_image_filename', uploadedImageFilename);
    formData.append('timestamp', timestamp);

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

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${apiDomain}/api/upload-audience`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading CSV file');
    }
};

import axios from 'axios';
import getConfig from './config';

const { apiDomain, staticDomain } = getConfig();

const handleApiError = (error) => {
    const errorMsg = error.response?.data?.detail || 'Unknown error';
    throw new Error(errorMsg);
};

export const fetchTargetOptions = async () => {
    try {
        const response = await axios.get(`${apiDomain}/api/target-audiences`);
        return response.data;
    } catch (error) {
        handleApiError(error);
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
        return response.data; // 確保返回的數據包含 filename 和 timestamp
    } catch (error) {
        handleApiError(error);
    }
};

export const generateProduct = async (productName, productDescribe, selectedAudiences, uploadedImageFilename, timestamp) => {
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('product_describe', productDescribe);
    formData.append('target_audience', `${selectedAudiences.gender},${selectedAudiences.age},${selectedAudiences.occupation},${selectedAudiences.interest}`);
    formData.append('product_image_filename', uploadedImageFilename);
    formData.append('timestamp', timestamp);

    try {
        const response = await axios.post(`${apiDomain}/api/generate-product`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${apiDomain}/api/history`);
        return response.data;
    } catch (error) {
        handleApiError(error);
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
        handleApiError(error);
    }
};

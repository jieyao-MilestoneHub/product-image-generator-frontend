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
        return response.data; // 確保返回的數據包含 filename 和 timestamp
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

export const generateText = async (projectName, projectDescribe, selectedAudiences) => {
    const formData = new FormData();
    formData.append('product_name', projectName);
    formData.append('product_describe', projectDescribe);
    formData.append('audience_types', selectedAudiences.join(','));

    try {
        const response = await axios.post(`${apiDomain}/api/generate-text`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.texts;
    } catch (error) {
        throw new Error('Error generating texts');
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

export const generateProject = async (projectName, projectDescribe, selectedAudiences, uploadedImageFilename, timestamp) => {
    try {
        const [texts, images] = await Promise.all([
            generateText(projectName, projectDescribe, selectedAudiences),
            generateImages(projectName, projectDescribe, selectedAudiences, uploadedImageFilename, timestamp)
        ]);

        // 圖像 URL 與生成的文本放在一起
        const combinedResults = texts.map((text, index) => ({
            imageUrl: images[index],
            shortText: text.shortText,
            longText: text.longText,
            audienceType: text.audienceType
        }));

        return combinedResults;
    } catch (error) {
        throw new Error('Error generating project');
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

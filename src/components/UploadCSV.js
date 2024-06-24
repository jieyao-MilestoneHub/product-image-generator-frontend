import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadCSV } from '../api';
import '../styles/UploadCSV.css';

const UploadCSV = ({ onChartData }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("請選擇一個CSV文件！");
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await uploadCSV(file);
            onChartData(response);
        } catch (error) {
            setError("上傳文件或處理數據失敗。");
        }
        setIsLoading(false);
    };

    return (
        <div className="upload-csv">
            <h2>上傳CSV文件</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload} className="upload-button">上傳並分析</button>
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

UploadCSV.propTypes = {
    onChartData: PropTypes.func.isRequired,
};

export default UploadCSV;

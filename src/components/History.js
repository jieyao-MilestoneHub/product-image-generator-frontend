import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import '../styles/History.css';

const History = () => {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/history');
                setHistoryData(response.data);
            } catch (error) {
                console.error('Error fetching history data:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history">
            <h2>歷史紀錄</h2>
            {historyData.length > 0 ? (
                historyData.map((record, index) => (
                    <div key={index} className="history-record">
                        <h3>{record.project_name}</h3>
                        <p><strong>定向描述:</strong> {record.target_audience}</p>
                        <div className="history-images">
                            <img
                                src={`http://localhost:8000/static/${record.product_image_filename}`}
                                alt={`Product ${index}`}
                                className="product-image"
                            />
                            <div className="generated-images">
                                {record.generated_images.map((image, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={`http://localhost:8000/static/${image}`}
                                        alt={`Generated ${imgIndex}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p><strong>時間:</strong> {record.write_date}</p>
                    </div>
                ))
            ) : (
                <p>No history records found.</p>
            )}
            <Footer />
        </div>
    );
};

export default History;

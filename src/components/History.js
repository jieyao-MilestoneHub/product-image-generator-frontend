import React, { useEffect, useState } from 'react';
import { fetchHistory, getStaticUrl } from '../api';
import Footer from './Footer';
import '../styles/History.css';

const History = () => {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const getHistory = async () => {
            try {
                const data = await fetchHistory();
                setHistoryData(data);
            } catch (error) {
                console.error('Error fetching history data:', error);
            }
        };

        getHistory();
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
                                src={getStaticUrl(record.product_image_filename)}
                                alt={`Product ${index}`}
                                className="product-image"
                            />
                            <div className="generated-images">
                                {record.generated_images.map((image, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={getStaticUrl(image)}
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

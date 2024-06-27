import React, { useEffect, useState } from 'react';
import moment from 'moment';
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
                        <h3>{record.product_name}: {record.product_describe}</h3>
                        <p><strong>定向描述:</strong> {record.target_audience}</p>
                        <div className="history-images">
                            <div className="original-image">
                                <img
                                    src={getStaticUrl(record.product_image_filename)}
                                    alt={`Product ${index}`}
                                    className="product-image"
                                />
                            </div>
                            <div className="generated-images">
                                {record.generated_images.map((image, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={getStaticUrl(image)}
                                        alt={`Generated ${imgIndex}`}
                                        className="generated-image"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="ad-texts">
                            <p><strong>短文案:</strong> {record.short_ad}</p>
                            <p><strong>長文案:</strong> {record.long_ad}</p>
                        </div>
                        <p><strong>時間:</strong> {moment(record.write_date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}</p>
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

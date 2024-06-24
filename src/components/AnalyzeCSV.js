import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import '../styles/AnalyzeCSV.css';

const AnalyzeCSV = ({ data }) => {
    return (
        <div className="analyze-csv">
            <h2>分析結果</h2>
            <div className="chart-wrapper">
                <div className="chart-item">
                    <h3>性別標籤</h3>
                    <Chart data={data.gender_data} label="性別" />
                </div>
                <div className="chart-item">
                    <h3>年齡標籤</h3>
                    <Chart data={data.age_data} label="年齡" />
                </div>
                <div className="chart-item">
                    <h3>職業標籤</h3>
                    <Chart data={data.occupation_data} label="職業" />
                </div>
                <div className="chart-item">
                    <h3>興趣標籤</h3>
                    <Chart data={data.interest_data} label="興趣" />
                </div>
            </div>
        </div>
    );
};

AnalyzeCSV.propTypes = {
    data: PropTypes.shape({
        gender_data: PropTypes.object.isRequired,
        age_data: PropTypes.object.isRequired,
        occupation_data: PropTypes.object.isRequired,
        interest_data: PropTypes.object.isRequired,
    }).isRequired,
};

export default AnalyzeCSV;

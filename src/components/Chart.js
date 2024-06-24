import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/Chart.css';

const Chart = ({ data, label }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: label,
                data: data.values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                hoverBorderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        animation: {
            duration: 2000,
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: label,
                font: {
                    size: 20,
                },
                padding: {
                    top: 20,
                    bottom: 10,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '種類',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: '數量',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

Chart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        values: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
};

export default Chart;

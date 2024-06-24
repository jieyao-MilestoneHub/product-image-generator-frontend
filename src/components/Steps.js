import React from 'react';
import '../styles/Steps.css';

const Steps = ({ currentStep, onStepChange }) => {
    const steps = [
        "統計人群包",
        "設定投放目標",
        "生成精準投放素材"
    ];

    const handleClick = (index) => {
        if (index <= currentStep) {
            onStepChange(index);
        }
    };

    return (
        <div className="steps-container">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div 
                        className={`step ${index <= currentStep ? 'active' : ''}`} 
                        onClick={() => handleClick(index)}
                    >
                        <div className="step-number">{index + 1}</div>
                        <div className="step-description">{step}</div>
                    </div>
                    {index < steps.length - 1 && <div className="arrow">→</div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Steps;

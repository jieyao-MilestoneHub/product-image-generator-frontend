import React, { useState, useEffect, useCallback } from 'react';
import UploadCSV from './UploadCSV';
import AnalyzeCSV from './AnalyzeCSV';
import ProjectForm from './ProjectForm';
import GeneratedImages from './GeneratedImages';
import Footer from './Footer';
import Steps from './Steps';
import '../styles/NewProject.css';

const NewProject = ({ project }) => {
    const [images, setImages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [formData, setFormData] = useState({}); // 儲存表單數據 (防止切換步驟失去已填寫數據)

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '確定不保存紀錄嗎？';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleImagesGenerated = (newImages) => {
        setImages(newImages);
        setCurrentStep(2); // 生成圖片後進入第三步驟
    };

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    const handleChartData = (data) => {
        // console.log('Chart data received:', data);
        setChartData(data);
    };

    const handleFormDataChange = useCallback((newFormData) => {
        setFormData(newFormData);
    }, []);

    return (
        <div className="new-project">
            <Steps currentStep={currentStep} onStepChange={handleStepChange} />
            {currentStep === 0 && (
                <div className="upload-csv-container">
                    <UploadCSV onChartData={handleChartData} />
                    {chartData && chartData.gender_data && chartData.age_data && chartData.occupation_data && chartData.interest_data && (
                        <>
                            <AnalyzeCSV data={chartData} />
                        </>
                    )}
                    <div className="button-container">
                        <button className="next-button" onClick={() => handleStepChange(1)}>下一步</button>
                    </div>
                </div>
            )}
            {currentStep === 1 && (
                <div className="project-form-container">
                    <ProjectForm 
                        onImagesGenerated={handleImagesGenerated} 
                        formData={formData} 
                        onFormDataChange={handleFormDataChange} 
                    />
                    <div className="button-container">
                        <button className="previous-button" onClick={() => handleStepChange(0)}>上一步</button>
                        <button className="next-button" onClick={() => handleStepChange(2)}>下一步</button>
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="generated-images-container">
                    <GeneratedImages images={images} />
                    <div className="button-container">
                        <button className="previous-button" onClick={() => handleStepChange(1)}>上一步</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default NewProject;

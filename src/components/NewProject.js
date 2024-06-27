import React, { useState, useEffect, useCallback } from 'react';
import UploadCSV from './UploadCSV';
import AnalyzeCSV from './AnalyzeCSV';
import ProjectForm from './ProjectForm';
import GeneratedItem from './GeneratedItem';
import Footer from './Footer';
import Steps from './Steps';
import '../styles/NewProject.css';

const NewProject = ({ project }) => {
    const [images, setImages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [formData, setFormData] = useState({}); // 儲存表單數據 (防止切換步驟失去已填寫數據)
    const [audience, setAudience] = useState("");
    const [shortText, setShortText] = useState("");
    const [longText, setLongText] = useState("");

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

    const handleProjectsGenerated = (projectInfo) => {
        console.log("Generated project info:", projectInfo);
        if (projectInfo && projectInfo.generated_images) {
            const imagesWithInfo = projectInfo.generated_images.map((image, index) => ({
                imageUrl: image,
            }));
            setImages(imagesWithInfo);
            setAudience(projectInfo.target_audience);
            setShortText(projectInfo.short_ad);
            setLongText(projectInfo.long_ad);
            setCurrentStep(2); // 生成圖片後進入第三步驟
        } else {
            console.error("Invalid project info format");
        }
    };

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    const handleChartData = (data) => {
        setChartData(data);
    };

    const handleFormDataChange = useCallback((newFormData) => {
        setFormData(newFormData);
    }, []);

    return (
        <div className="new-project">
            <Steps currentStep={currentStep} onStepChange={handleStepChange} />
            <div className="content-container">
                {currentStep === 0 && (
                    <div className="upload-csv-container">
                        <UploadCSV onChartData={handleChartData} />
                        {chartData && chartData.gender_data && chartData.age_data && chartData.occupation_data && chartData.interest_data && (
                            <AnalyzeCSV data={chartData} />
                        )}
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="project-form-container">
                        <ProjectForm 
                            onImagesGenerated={handleProjectsGenerated} 
                            formData={formData} 
                            onFormDataChange={handleFormDataChange} 
                        />
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="generated-images-container">
                        <GeneratedItem 
                            images={images} 
                            audience={audience} 
                            shortText={shortText} 
                            longText={longText} 
                        />
                    </div>
                )}
                <div className="button-container">
                    {currentStep > 0 && (
                        <button className="previous-button" onClick={() => handleStepChange(currentStep - 1)}>上一步</button>
                    )}
                    {currentStep < 2 && (
                        <button className="next-button" onClick={() => handleStepChange(currentStep + 1)}>下一步</button>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NewProject;

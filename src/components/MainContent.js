import React from 'react';
import NewProject from './NewProject';
import History from './History';
import Manual from './Manual';
import '../styles/MainContent.css';

const MainContent = ({ project }) => {
    return (
        <div className="main-content">
            <div className="section">
                {project === "新增素材" && <NewProject project={project} />}
                {project === "歷史紀錄" && <History project={project} />}
                {project === "使用手冊" && <Manual project={project} />}
            </div>
        </div>
    );
};

export default MainContent;

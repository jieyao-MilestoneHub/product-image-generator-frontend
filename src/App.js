import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <Routes>
                    <Route path="/item1" element={<MainContent project="新增素材" />} />
                    <Route path="/item2" element={<MainContent project="歷史紀錄" />} />
                    <Route path="/item3" element={<MainContent project="使用手冊" />} />
                    <Route path="/" element={<MainContent project="新增素材" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
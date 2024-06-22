import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <Routes>
                    <Route path="/item1" element={<MainContent project="選項一" />} />
                    <Route path="/item2" element={<MainContent project="選項二" />} />
                    <Route path="/item3" element={<MainContent project="選項三" />} />
                    <Route path="/" element={<MainContent project="選項一" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
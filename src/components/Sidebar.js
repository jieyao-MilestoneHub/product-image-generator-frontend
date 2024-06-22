import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaCog } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    
    return (
        <div className="sidebar">
            <h2>選單</h2>
            <ul>
                <li className={location.pathname === '/item1' ? 'active' : ''}>
                    <Link to="/item1">
                        <FaHome className="icon" />
                        <span>選項一</span>
                    </Link>
                </li>
                <li className={location.pathname === '/item2' ? 'active' : ''}>
                    <Link to="/item2">
                        <FaProjectDiagram className="icon" />
                        <span>選項二</span>
                    </Link>
                </li>
                <li className={location.pathname === '/item3' ? 'active' : ''}>
                    <Link to="/item3">
                        <FaCog className="icon" />
                        <span>選項三</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

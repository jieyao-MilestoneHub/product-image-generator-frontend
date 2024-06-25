import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlusSquare, FaHistory, FaBook } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <h2>選單</h2>
            <ul>
                <li className={location.pathname === '/item1' ? 'active' : ''}>
                    <Link to="/item1">
                        <FaPlusSquare className="icon" />
                        <span>新增素材</span>
                    </Link>
                </li>
                <li className={location.pathname === '/item2' ? 'active' : ''}>
                    <Link to="/item2">
                        <FaHistory className="icon" />
                        <span>歷史紀錄</span>
                    </Link>
                </li>
                <li className={location.pathname === '/item3' ? 'active' : ''}>
                    <Link to="/item3">
                        <FaBook className="icon" />
                        <span>使用手冊</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

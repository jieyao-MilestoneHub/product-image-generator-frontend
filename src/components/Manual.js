import React from 'react';
import Footer from './Footer';
import '../styles/Manual.css';

const Manual = () => {
    return (
        <div className="manual">
            <h2>使用手冊</h2>
            <div className="manual-section">
                <h3>簡介</h3>
                <p>歡迎使用我們的系統。此使用手冊將引導您如何使用各種功能。</p>
            </div>
            <div className="manual-section">
                <h3>目錄</h3>
                <ul>
                    <li><a href="#upload-image">設定受眾</a></li>
                    <li><a href="#generate-images">生成圖片</a></li>
                    <li><a href="#view-history">查看歷史紀錄</a></li>
                    <li><a href="#target-audience">目標受眾設定</a></li>
                    <li><a href="#troubleshooting">故障排除</a></li>
                </ul>
            </div>
            <div className="manual-section" id="upload-image">
                <h3>設定受眾</h3>
                <p>在專案頁面，您可以通過填妥表單來開始一個新的專案。</p>
                <ol>
                    <li>為專案取名，填寫"專案名稱"。</li>
                    <li>選擇投放定向，點擊"選擇投放定向"下拉選單。</li>
                    <li>點擊"選擇圖片"按鈕並選擇您要上傳的圖片。</li>
                    <li>選擇完成後，點擊"生成圖片"按鈕。</li>
                </ol>
            </div>
            <div className="manual-section" id="generate-images">
                <h3>生成圖片</h3>
                <p>在上傳圖片後，按下"生成圖片"按鈕。您可以在生成圖片區域查看這些圖片。</p>
                <ul>
                    <li>系統將透過AIGC得到多張廣告素材，這些素材將瞄準欲投放之受眾來生成。</li>
                </ul>
            </div>
            <div className="manual-section" id="view-history">
                <h3>查看歷史紀錄</h3>
                <p>在歷史紀錄頁面，您可以查看過去的專案和生成的圖片。</p>
                <ul>
                    <li>每個專案都會顯示項目名稱、定向描述、產品圖片和生成的圖片。</li>
                    <li>點擊某個專案，可以查看其詳細信息和相關圖片。</li>
                </ul>
            </div>
            <div className="manual-section" id="target-audience">
                <h3>目標受眾設定</h3>
                <p>在專案頁面，您可以選擇多個目標受眾來定義您的專案。</p>
                <ol>
                    <li>選擇適合的受眾後，系統會根據這些設定生成相應的圖片。</li>
                    <li>您可以在生成圖片區域查看根據這些設定生成的圖片。</li>
                </ol>
            </div>
            <div className="manual-section" id="troubleshooting">
                <h3>故障排除</h3>
                <p>如果您在使用過程中遇到任何問題，請聯繫我們的支持團隊。</p>
                <p>聯繫郵件：<a href="mailto:jiao@clickforce.com.tw">jiao@clickforce.com.tw</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default Manual;

# 使用指南

這個專案旨在透過 AIGC 解決廣告素材製作成本的問題，需要搭配 `product-image-generator-backend` 一起使用。

## 啟動網頁

1. 確保完成 [`product-image-generator-backend`](https://github.com/jieyao-MilestoneHub/product-image-generator-backend) 中的步驟 
2. 在終端中執行 `npm start` 命令啟動前端應用

## 配置文件

本專案使用 `config.js` 文件來管理 API 路徑和其他配置。請根據您的環境設定配置文件。

### 配置文件結構

`config.js` 文件位於 `src` 目錄下，文件結構如下：

```javascript
const config = {
    development: {
        apiDomain: 'http://localhost:8000',
        staticDomain: 'http://localhost:8000/static'
    },
    production: {
        apiDomain: 'https://api.yourdomain.com',
        staticDomain: 'https://api.yourdomain.com/static'
    },
    test: {
        apiDomain: 'http://localhost:8000',
        staticDomain: 'http://localhost:8000/static'
    }
};

const getConfig = () => {
    const env = process.env.REACT_APP_ENV || 'development';
    return config[env];
};

export default getConfig;
```

## 使用配置文件

在需要引用配置的地方使用 getConfig 函數來獲取當前環境的配置。例如：

```javascript
import getConfig from './config';

const { apiDomain, staticDomain } = getConfig();

console.log('API Domain:', apiDomain);
console.log('Static Domain:', staticDomain);
```

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

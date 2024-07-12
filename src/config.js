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
    return {
        apiDomain: process.env.REACT_APP_API_DOMAIN || config[env].apiDomain,
        staticDomain: process.env.REACT_APP_STATIC_DOMAIN || config[env].staticDomain
    };
};

export default getConfig;

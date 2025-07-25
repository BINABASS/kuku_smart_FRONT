const API_CONFIG = {
    development: {
        baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8001/api',
        timeout: 10000,
    },
    production: {
        baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8001/api',
        timeout: 10000,
    },
};

export const API_URL = API_CONFIG[process.env.NODE_ENV || 'development'].baseURL;
export const API_TIMEOUT = API_CONFIG[process.env.NODE_ENV || 'development'].timeout;

const config = {
    dev: {
        token: '<TOKEN>',
        dbUrl: 'mongodb://127.0.0.1:27017/tsbot',
        webhook: {
            useWebhook: false,
            secretPath: '/secret',
            port: 3000,
            tlsOptions: null
        }
    },
    prod: {
        token: '<TOKEN>',
        dbUrl: 'mongodb://127.0.0.1:27017/tsbot',
        webhook: {
            useWebhook: false,
            secretPath: '/secret',
            port: 8080,
            tlsOptions: null
        }
    }
};

export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;

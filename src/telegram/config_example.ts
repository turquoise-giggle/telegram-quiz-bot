const config = {
	dev: {
		token: '<TOKEN>',
		webhook: {
			useWebhook: false,
			secretPath: '/secret',
			port: 3000,
			tlsOptions: null
		}
	},
	prod: {
		token: '<TOKEN>',
		webhook: {
			useWebhook: false,
			secretPath: '/secret',
			port: 8080,
			tlsOptions: null
		}
	}
};

export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;

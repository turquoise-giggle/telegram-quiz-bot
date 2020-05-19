const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === 'production';

const config = {
	prod: {
		// Production config
		ssl: {
			keyPath: 'privkey.pem',
			certPath: 'cert.pem',
			chainPath: 'chain.pem'
		},
		host: 'HOST',
		httpPort: 80,
		httpsPort: 443,
		sessionSecret: 'SECRET',
		cors: {
			credentials: true
		}
	},
	dev: {
		// Development config
		ssl: {
			keyPath: 'privkey.pem',
			certPath: 'cert.pem',
			chainPath: 'chain.pem'
		},
		host: 'HOST',
		httpPort: 80,
		httpsPort: 443,
		sessionSecret: 'SECRET',
		cors: {
			credentials: true
		}
	}
};

export default isProduction ? config.prod : config.dev;

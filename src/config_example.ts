const config = {
	dev: {
		dbUrl: 'mongodb://127.0.0.1:27017/tsbot',
	},
	prod: {
		dbUrl: 'mongodb://127.0.0.1:27017/tsbot',
	}
};

export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;

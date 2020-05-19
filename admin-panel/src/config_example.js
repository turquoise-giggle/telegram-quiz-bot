const config = {
  dev: {
	api: {
	  host: 'localhost',
	  port: 80
	}
  },
  prod: {
	api: {
	  host: 'localhost',
	  port: 8888
	}
  }
};

export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;

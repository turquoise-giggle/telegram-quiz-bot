import fs from 'fs';
import util from 'util';
import http from 'http';
import https from 'https';
import Koa from 'koa';
import middlewares from './middlewares/middlewares';
import router from './router/router';

import config from './config';

// SSL
const SSL = {
	key: fs.readFileSync(config.ssl.keyPath),
	cert: fs.readFileSync(config.ssl.certPath),
	ca: fs.readFileSync(config.ssl.chainPath)
};

const Server = {
	app: null,
	init: async function() {
		// Singletone method
		if (this.app) {
			return;
		}

		this.app = new Koa();

		middlewares.init(this.app);
		router.init(this.app);

		// Http server
		const httpServer = http.createServer(this.app.callback());
		// Https server
		const httpsServer = https.createServer(SSL, this.app.callback());

		try {
			//@ts-ignore
			await util.promisify(httpServer.listen).call(httpServer, config.httpPort);
			//@ts-ignore
			await util.promisify(httpsServer.listen).call(httpsServer, config.httpsPort);
			console.log('=> Сервер инициализирован');
		} catch (err) {
			console.error(err);
			process.exit(1);
		}
	}
};

export default Server;

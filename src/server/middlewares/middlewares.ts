import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';
import cors from 'koa2-cors';

import config from '../config';

const STATIC_PATH = path.join(__dirname, '..', '..', '..', 'admin-panel', 'build');
const SESSION_CONFIG = {
	key: 'koa.sess',
	maxAge: 1e3 * 60 * 60 * 24 * 14 // 2 weeks
};

const Middlewares = {
	isInit: false,
	init: function(app) {
		if (this.isInit) {
			return;
		}

		this.isInit = true;

		app.use(cors(config.cors));

		// Session secret key
		app.keys = [config.sessionSecret];

		// HTTPS middleware
		app.use(async (ctx, next) => {
			if (ctx.secure) {
				await next();
			} else {
				const httpsPath = `https://${ctx.host}${ctx.url}`;
				ctx.status = 308;
				ctx.redirect(httpsPath);
			}
		});

		// Session middleware
		app.use(session(SESSION_CONFIG, app));

		app.use(bodyParser());
		app.use(koaStatic(STATIC_PATH));

		console.log('=> [Server] Middlewares инициализированы');
	}
};

export default Middlewares;

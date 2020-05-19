import path from 'path';
import send from 'koa-send';

import { getAdmins, getAdmin, checkPassword } from '../../helpers/admins';

const STATIC_PATH = path.join(__dirname, '..', '..', '..', 'admin-panel', 'build');

const handlers = {
	auth: {
		check: async (ctx) => {
			ctx.body = {
				login: !!ctx.session.isAuth
			};
		},
		login: async (ctx) => {
			const { username, password } = ctx.request.body;
			if (!username || !password) {
				return (ctx.status = 400);
			}
			try {
				const valid = await checkPassword(username, password);

				ctx.session = {
					username,
					isAuth: valid
				};

				ctx.status = 200;
				ctx.body = {
					login: valid
				};
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		logout: async (ctx) => {
			ctx.session.isAuth = false;
			ctx.status = 200;
		}
	},
	panel: {
		main: async (ctx) => {
			ctx.status = 200;
			await send(ctx, 'index.html', { root: STATIC_PATH });
		}
	}
};

export default handlers;

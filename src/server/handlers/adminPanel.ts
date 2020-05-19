import path from 'path';
import send from 'koa-send';
import upload from '../libs/multer';
import { DEST_PATH } from '../libs/multer';
import { getAdmins, getAdmin, checkPassword } from '../../helpers/admins';
import config from '../config';

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
		},
		upload: async (ctx) => {
			const data = await upload(ctx);

			const files = data.files;

			const filename =
				files && files.image && files.image[0] && files.image[0].filename ? files.image[0].filename : null;
			const imageUrl = filename
				? encodeURI(`https://${config.host}:${config.httpsPort}/api/file?filename=${filename}`)
				: null;

			if (!imageUrl) {
				return (ctx.status = 400);
			}

			ctx.status = 200;
			ctx.body = {
				imageUrl
			};
		},
		file: async (ctx) => {
			const { filename } = ctx.query;
			if (!filename) {
				return (ctx.status = 400);
			}
			await send(ctx, filename, { root: DEST_PATH });
		}
	}
};

export default handlers;

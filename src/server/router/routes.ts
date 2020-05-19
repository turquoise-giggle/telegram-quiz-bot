import adminPanelHandlers from '../handlers/adminPanel';

const Routes = {
	isInit: false,
	getAuthCheckedHandler: function(handler) {
		return async function(ctx) {
			if (!ctx.session.isAuth) {
				return (ctx.status = 401);
			}
			await handler(ctx);
		};
	},
	init: function(router) {
		if (this.isInit) {
			return;
		}

		this.isInit = true;

		/*** Test handler ***/
		router.get('/api/test', async (ctx) => {
			ctx.status = 200;
			ctx.body = { ok: true };
		});
		
		/*** Admin panel ***/
		router.get('/api/auth/check', adminPanelHandlers.auth.check);
		router.post('/api/auth/login', adminPanelHandlers.auth.login);
		router.get('/api/auth/logout', adminPanelHandlers.auth.logout);
		router.get('*', adminPanelHandlers.panel.main);
	}
};

export default Routes;

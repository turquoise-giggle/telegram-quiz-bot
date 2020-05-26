import adminPanelHandlers from '../handlers/adminPanel';
import pollsHandlers from '../handlers/polls';
import quizesHandlers from '../handlers/quizes';

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

		/*** Polls ***/
		router.get('/api/poll/read', this.getAuthCheckedHandler(pollsHandlers.poll.read));
		router.post('/api/poll/create', this.getAuthCheckedHandler(pollsHandlers.poll.create));
		router.post('/api/poll/update', this.getAuthCheckedHandler(pollsHandlers.poll.update));
		router.post('/api/poll/delete', this.getAuthCheckedHandler(pollsHandlers.poll.delete));
		router.get('/api/poll/post', this.getAuthCheckedHandler(pollsHandlers.poll.post));
		router.get('/api/poll/interval/read', this.getAuthCheckedHandler(pollsHandlers.interval.read));
		router.get('/api/poll/interval/update', this.getAuthCheckedHandler(pollsHandlers.interval.update));

		/*** Quizes ***/
		router.get('/api/quiz/read', this.getAuthCheckedHandler(quizesHandlers.read));
		router.post('/api/quiz/create', this.getAuthCheckedHandler(quizesHandlers.create));
		router.post('/api/quiz/update', this.getAuthCheckedHandler(quizesHandlers.update));
		router.post('/api/quiz/delete', this.getAuthCheckedHandler(quizesHandlers.delete));
		router.get('/api/quiz/post', this.getAuthCheckedHandler(quizesHandlers.post));
		
		/*** Admin panel ***/
		router.get('/api/auth/check', adminPanelHandlers.auth.check);
		router.post('/api/auth/login', adminPanelHandlers.auth.login);
		router.get('/api/auth/logout', adminPanelHandlers.auth.logout);
		router.post('/api/upload', this.getAuthCheckedHandler(adminPanelHandlers.panel.upload));
		router.get('/api/file', adminPanelHandlers.panel.file);
		router.get('*', adminPanelHandlers.panel.main);
	}
};

export default Routes;

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
		router.get('/api/poll/results/day/read', this.getAuthCheckedHandler(pollsHandlers.results.day.read));
		router.get('/api/poll/results/week/read', this.getAuthCheckedHandler(pollsHandlers.results.week.read));

		/*** Quizes ***/
		router.get('/api/quiz/read', this.getAuthCheckedHandler(quizesHandlers.quiz.read));
		router.post('/api/quiz/create', this.getAuthCheckedHandler(quizesHandlers.quiz.create));
		router.post('/api/quiz/update', this.getAuthCheckedHandler(quizesHandlers.quiz.update));
		router.post('/api/quiz/delete', this.getAuthCheckedHandler(quizesHandlers.quiz.delete));
		router.get('/api/quiz/post', this.getAuthCheckedHandler(quizesHandlers.quiz.post));
		router.get('/api/quiz/results/read', this.getAuthCheckedHandler(quizesHandlers.results.read));
		
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

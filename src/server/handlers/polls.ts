import Daemon from '../../daemon/daemon';
import { getVar } from '../../helpers/vars';
import { bufferToStream } from '../../helpers/functions';
import { postPoll } from '../../telegram/helpers/channel';
import {
	getPollResultsTableToday,
	getPollResultsTableCurrentWeek
} from '../../helpers/excel';
import {
	addPoll,
	getPolls,
	updatePoll,
	deletePoll,
	getStatusTypeTexts
} from '../../helpers/polls';

const handlers = {
	poll: {
		create: async (ctx) => {
			const {
				answerTime,
				image,
				answers,
				texts,
				postTime
			} = ctx.request.body;
			if (!image || !answers || !answers.length || !postTime) {
				return (ctx.status = 400);
			}
			try {
				const poll = await addPoll({
					answerTime,
					image,
					answers,
					texts,
					postTime
				});
				ctx.status = 200;
				ctx.body = {
					id: poll._id
				};
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		read: async (ctx) => {
			try {
				const polls = await getPolls();
				const statuses = getStatusTypeTexts();
				ctx.status = 200;
				const body = {
					statuses,
					polls: polls.map((poll) => {
						return {
							id: poll._id,
							answerTime: poll.answerTime,
							image: poll.image,
							answers: poll.answers,
							postTime: poll.postTime,
							status: poll.status
						};
					})
				};
				ctx.body = body;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		update: async (ctx) => {
			const {
				id,
				answerTime,
				answers
			} = ctx.request.body;
			if (!id || !(answerTime || (answers && answers.length))) {
				return (ctx.status = 400);
			}

			const update: any = {};
			if (answerTime) {
				update.answerTime = answerTime;
			}
			if (answers) {
				update.answers = answers;
			}

			try {
				await updatePoll(id, update);
				ctx.status = 200;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		delete: async (ctx) => {
			const { ids } = ctx.request.body;

			if (!ids || !Array.isArray(ids)) {
				return (ctx.status = 400);
			}

			try {
				for (const id of ids) {
					await deletePoll(id);
				}
				ctx.status = 200;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		post: async (ctx) => {
			const { id } = ctx.query;

			if (!id) {
				return (ctx.status = 400);
			}

			try {
				await postPoll(id);
				ctx.status = 200;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		}
	},
	results: {
		day: {
			read: async (ctx) => {
				try {
					const table = await getPollResultsTableToday();
					ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent('Рейтинг опросы день.xlsx'));
					ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
					ctx.body = bufferToStream(table);
					ctx.status = 200;
				} catch (err) {
					console.error(err);
					ctx.status = 500;
				}
			}
		},
		week: {
			read: async (ctx) => {
				try {
					const table = await getPollResultsTableCurrentWeek();
					ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent('Рейтинг опросы неделя.xlsx'));
					ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
					ctx.body = bufferToStream(table);
					ctx.status = 200;
				} catch (err) {
					console.error(err);
					ctx.status = 500;
				}
			}
		},
	}
};

export default handlers;

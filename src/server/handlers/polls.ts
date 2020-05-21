import { postPoll } from '../../telegram/helpers/channel';
import {
	addPoll,
	getPolls,
	updatePoll,
	deletePoll
} from '../../helpers/polls';

const handlers = {
	create: async (ctx) => {
		const {
			answerTime,
			image,
			answers
		} = ctx.request.body;
		if (!answerTime || !image || !answers || !answers.length) {
			return (ctx.status = 400);
		}
		try {
			const poll = await addPoll({
				answerTime,
				image,
				answers
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
			ctx.status = 200;
			const body = {
				polls: polls.map((poll) => {
					return {
						status: poll.status,
						answerTime: poll.answerTime,
						image: poll.image,
						answers: poll.answers,
						priority: poll.priority
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
};

export default handlers;

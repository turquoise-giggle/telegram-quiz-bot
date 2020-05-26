import { bufferToStream } from '../../helpers/functions';
import { postQuiz } from '../../telegram/helpers/channel';
import { getQuizResultsTable } from '../../helpers/excel';
import {
	addQuiz,
	getQuizes,
	updateQuiz,
	deleteQuiz
} from '../../helpers/quizes';

const handlers = {
	quiz: {
		create: async (ctx) => {
			const {
				name,
				prize,
				answerTime,
				questions
			} = ctx.request.body;
			if (!name || !prize || !answerTime || !questions || !questions.length) {
				return (ctx.status = 400);
			}
			try {
				const quiz = await addQuiz({
					name,
					prize,
					answerTime,
					questions
				});
				ctx.status = 200;
				ctx.body = {
					id: quiz._id
				};
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		},
		read: async (ctx) => {
			try {
				const quizes = await getQuizes();
				ctx.status = 200;
				const body = {
					quizes: quizes.map((quiz) => {
						return {
							id: quiz._id,
							name: quiz.name,
							prize: quiz.prize,
							status: quiz.status,
							answerTime: quiz.answerTime,
							questions: quiz.questions
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
				name,
				prize,
				answerTime,
				questions
			} = ctx.request.body;
			if (!id || !(name || prize || answerTime || (questions && questions.length))) {
				return (ctx.status = 400);
			}

			const update: any = {};
			if (name) {
				update.name = name;
			}
			if (prize) {
				update.prize = prize;
			}
			if (answerTime) {
				update.answerTime = answerTime;
			}
			if (questions) {
				update.questions = questions;
			}

			try {
				await updateQuiz(id, update);
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
					await deleteQuiz(id);
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
				await postQuiz(id);
				ctx.status = 200;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		}
	},
	results: {
		read: async (ctx) => {
			const { id } = ctx.query;

			if (!id) {
				return (ctx.status = 400);
			}

			try {
				const table = await getQuizResultsTable(id);
				ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent('Результаты викторина.xlsx'));
				ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
				ctx.body = bufferToStream(table);
				ctx.status = 200;
			} catch (err) {
				console.error(err);
				ctx.status = 500;
			}
		}
	}
};

export default handlers;

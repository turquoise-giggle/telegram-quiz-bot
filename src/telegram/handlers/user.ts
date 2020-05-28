import { Markup, Stage } from 'telegraf';
import StartMessage from '../controllers/start';
import Texts from '../../texts/texts';
import { getQuizResult, updateQuizResultSuccess } from '../../helpers/quizResults';
import { getPollResult, addPollResult } from '../../helpers/pollResults';

const AdminHandlers = {
	init: (bot) => {
		bot.action(/^validQuiz>/, async (ctx) => {
			const quizId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];
			const prevTerm = +ctx.callbackQuery.data.split('>')[3];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.timeIsOver'),
					true
				);
			}

			const quizResult = await getQuizResult(quizId, ctx.from.id);

			// User has already answered this question
			if (quizResult && quizResult.lastAnswerTerm === term) {
				return ctx.answerCbQuery();
			}
			// User has already failed this quiz
			if (quizResult && !quizResult.success) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.invalidPrevQuestion'),
					true
				);
			}
			// User didn't answered one of the previous questions
			if ((!quizResult && prevTerm) || (quizResult && quizResult.lastAnswerTerm !== prevTerm)) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.noAnswerPrevQuestion'),
					true
				);
			}
			
			// Set success to true
			await updateQuizResultSuccess(quizId, ctx.from.id, term, true);

			return ctx.answerCbQuery(
				Texts.getText('quiz.validAnswer'),
				true
			);
		});
		bot.action(/^invalidQuiz>/, async (ctx) => {
			const quizId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];
			const prevTerm = +ctx.callbackQuery.data.split('>')[3];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.timeIsOver'),
					true
				);
			}

			const quizResult = await getQuizResult(quizId, ctx.from.id);

			// User has already answered this question
			if (quizResult && quizResult.lastAnswerTerm === term) {
				return ctx.answerCbQuery();
			}
			// User has already failed this quiz
			if (quizResult && !quizResult.success) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.invalidPrevQuestion'),
					true
				);
			}
			// User didn't answered one of the previous questions
			if ((!quizResult && prevTerm) || (quizResult && quizResult.lastAnswerTerm !== prevTerm)) {
				return ctx.answerCbQuery(
					Texts.getText('quiz.noAnswerPrevQuestion'),
					true
				);
			}

			// Set success to false at this quiz
			await updateQuizResultSuccess(quizId, ctx.from.id, term, false);

			return ctx.answerCbQuery(
				Texts.getText('quiz.invalidAnswer'),
				true
			);
		});
		bot.action(/^validPoll>/, async (ctx) => {
			const pollId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					Texts.getText('poll.timeIsOver'),
					true
				);
			}

			const pollResult = await getPollResult(pollId, ctx.from.id);

			// User has already answered this question
			if (pollResult) {
				return ctx.answerCbQuery();
			}
			
			// Set success to true
			await addPollResult(pollId, ctx.from.id, true);

			return ctx.answerCbQuery(
				Texts.getText('poll.validAnswer'),
				true
			);
		});
		bot.action(/^invalidPoll>/, async (ctx) => {
			const pollId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					Texts.getText('poll.timeIsOver'),
					true
				);
			}

			const pollResult = await getPollResult(pollId, ctx.from.id);

			// User has already answered this question
			if (pollResult) {
				return ctx.answerCbQuery();
			}
			
			// Set success to true
			await addPollResult(pollId, ctx.from.id, false);

			return ctx.answerCbQuery(
				Texts.getText('poll.invalidAnswer'),
				true
			);
		});
	}
};

export default AdminHandlers;

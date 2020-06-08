import { Markup, Stage } from 'telegraf';
import StartMessage from '../controllers/start';
import Texts from '../../texts/texts';
import { getQuizResult, updateQuizResultSuccess } from '../../helpers/quizResults';
import { getPollResult, addPollResult } from '../../helpers/pollResults';
import {
	getQuizById,
	VALID_ANSWER_QUIZ_DEFAULT,
	INVALID_ANSWER_QUIZ_DEFAULT
} from '../../helpers/quizes';
import {
	getPollById,
	VALID_ANSWER_POLL_DEFAULT,
	INVALID_ANSWER_POLL_DEFAULT
} from '../../helpers/polls';

const AdminHandlers = {
	init: (bot) => {
		bot.action(/^vQ>/, async (ctx) => {
			const quizId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];
			const prevTerm = +ctx.callbackQuery.data.split('>')[3];
			const questionCounter = +ctx.callbackQuery.data.split('>')[4];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.timeIsOver'),
					true
				);
			}

			const quizResult = await getQuizResult(quizId, ctx.from.id);

			// User has already answered this question
			if (quizResult && quizResult.lastAnswerTerm === term) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.alreadyAnswered'),
					true
				);
			}
			// User has already failed this quiz
			if (quizResult && !quizResult.success) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.invalidPrevQuestion'),
					true
				);
			}
			// User didn't answered one of the previous questions
			if ((!quizResult && prevTerm) || (quizResult && quizResult.lastAnswerTerm !== prevTerm)) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.noAnswerPrevQuestion'),
					true
				);
			}

			// Set success to true
			await updateQuizResultSuccess(quizId, ctx.from.id, term, true);

			const quiz = await getQuizById(quizId);

			const message = quiz && quiz.questions[questionCounter] && quiz.questions[questionCounter].texts.validAnswer
				? quiz.questions[questionCounter].texts.validAnswer
				: VALID_ANSWER_QUIZ_DEFAULT;

			return ctx.answerCbQuery(message, true);
		});
		bot.action(/^invQ>/, async (ctx) => {
			const quizId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];
			const prevTerm = +ctx.callbackQuery.data.split('>')[3];
			const questionCounter = +ctx.callbackQuery.data.split('>')[4];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.timeIsOver'),
					true
				);
			}

			const quizResult = await getQuizResult(quizId, ctx.from.id);

			// User has already answered this question
			if (quizResult && quizResult.lastAnswerTerm === term) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.alreadyAnswered'),
					true
				);
			}
			// User has already failed this quiz
			if (quizResult && !quizResult.success) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.invalidPrevQuestion'),
					true
				);
			}
			// User didn't answered one of the previous questions
			if ((!quizResult && prevTerm) || (quizResult && quizResult.lastAnswerTerm !== prevTerm)) {
				return ctx.answerCbQuery(
					await Texts.getText('quiz.noAnswerPrevQuestion'),
					true
				);
			}

			// Set success to false at this quiz
			await updateQuizResultSuccess(quizId, ctx.from.id, term, false);

			const quiz = await getQuizById(quizId);

			const message = quiz && quiz.questions[questionCounter] && quiz.questions[questionCounter].texts.invalidAnswer
				? quiz.questions[questionCounter].texts.invalidAnswer
				: INVALID_ANSWER_QUIZ_DEFAULT;

			return ctx.answerCbQuery(message, true);
		});
		bot.action(/^validPoll>/, async (ctx) => {
			const pollId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					await Texts.getText('poll.timeIsOver'),
					true
				);
			}

			const pollResult = await getPollResult(pollId, ctx.from.id);

			// User has already answered this question
			if (pollResult) {
				return ctx.answerCbQuery(
					await Texts.getText('poll.alreadyAnswered'),
					true
				);
			}

			// Set success to true
			await addPollResult(pollId, ctx.from.id, true);

			const poll = await getPollById(pollId);

			return ctx.answerCbQuery(
				poll && poll.texts.validAnswer
					? poll.texts.validAnswer
					: VALID_ANSWER_POLL_DEFAULT,
				true
			);
		});
		bot.action(/^invalidPoll>/, async (ctx) => {
			const pollId = ctx.callbackQuery.data.split('>')[1];
			const term = +ctx.callbackQuery.data.split('>')[2];

			if (term < Date.now()) {
				return ctx.answerCbQuery(
					await Texts.getText('poll.timeIsOver'),
					true
				);
			}

			const pollResult = await getPollResult(pollId, ctx.from.id);

			// User has already answered this question
			if (pollResult) {
				return ctx.answerCbQuery(
					await Texts.getText('poll.alreadyAnswered'),
					true
				);
			}

			// Set success to true
			await addPollResult(pollId, ctx.from.id, false);

			const poll = await getPollById(pollId);

			return ctx.answerCbQuery(
				poll && poll.texts.invalidAnswer
					? poll.texts.invalidAnswer
					: INVALID_ANSWER_POLL_DEFAULT,
				true
			);
		});
	}
};

export default AdminHandlers;

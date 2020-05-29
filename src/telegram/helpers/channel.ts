import Bot from '../';
import Channel from '../models/channel';
import QuizStatusType from '../../enums/QuizStatusType';
import AnswerType from '../../enums/AnswerType';
import { getQuizAnswersKeyboard, getPollAnswersKeyboard } from './keyboards';
import { getQuizIntroMessage, getQuizMessage } from './messages';
import { countWinnersByQuizId, updateQuizResultSuccessByFilter } from '../../helpers/quizResults';
import { getPollById } from '../../helpers/polls';
import { getQuizById, updateQuizStatus } from '../../helpers/quizes';

const Markup = require('telegraf/markup');

const DEFAULT_FLAG = true;
const TIMEOUT_AFTER_INTRO = 30 * 1e3; // 30 sec
const ONE_YEAR_MILIS = 365 * 24 * 60 * 60 * 1e3; // 1 year

export async function getChannel() {
	return Channel.findOne({ flag: DEFAULT_FLAG });
}

export async function setChannel(chatId: number) {
	return Channel.findOneAndUpdate(
		{ flag: DEFAULT_FLAG },
		{ flag: DEFAULT_FLAG, chatId },
		{ upsert: true, new: true }
	);
}

export async function postQuiz(quizId: string) {
	const channel = await getChannel();
	const quiz = await getQuizById(quizId);

	if (!channel) {
		throw new Error('Channel isn\'t set');
	}
	if (!quiz) {
		throw new Error('Quiz wasn\'t found');
	}

	const bot = Bot.getBot();

	await bot.telegram.sendMessage(461738219, getQuizMessage(quiz));

	const { name, prize, answerTime, interval, questions } = quiz;

	const quizIntroMessage = getQuizIntroMessage(name, prize, answerTime);

	await bot.telegram.sendMessage(channel.chatId, quizIntroMessage, {
		parse_mode: 'HTML'
	});

	setTimeout(
		postNextQuizQuestion,
		TIMEOUT_AFTER_INTRO,
		bot,
		channel,
		questions,
		quizId
	);
}

export async function postNextQuizQuestion(bot, channel, questions, quizId, prevTerm: number = 0) {
	if (!questions.length) {
		// All who didn't answer all questions
		// success to false (not winner)
		await updateQuizResultSuccessByFilter(
			{
				quizId,
				success: true,
				lastAnswerTerm: { $lt: prevTerm }
			},
			false
		);
		// Update status of the quiz
		await updateQuizStatus(quizId, QuizStatusType.FINISHED);
		// Final message
		const numberOfWinners = await countWinnersByQuizId(quizId);
		const message = `Викторина <b>завершена</b>! Количество победителей: ${numberOfWinners} пользователей`;
		await bot.telegram.sendMessage(channel.chatId, message, {
			parse_mode: 'HTML'
		});
	} else {
		const quiz = await getQuizById(quizId);
		// Count intervals
		const { answerTime, interval } = quiz;
		const answerTimeMilis = answerTime * 1e3;
		const intervalMilis = interval
			? interval * 1e3
			: answerTimeMilis;
		// Get index of the question
		const questionCounter = quiz.questions.length - questions.length;
		// Get next question
		const question = questions.shift();
		// Store term in seconds (to save callbackQuery bytes)
		const term = Math.trunc((Date.now() + answerTimeMilis) / 1e3);
		const { image, answers } = question;
		const keyboard = getQuizAnswersKeyboard(
			answers,
			{
				term,
				id: quizId,
				prevTerm,
				questionCounter
			}
		);

		await bot.telegram.sendPhoto(channel.chatId, image, {
			reply_markup: keyboard
		});

		// Post next question timeout
		setTimeout(
			postNextQuizQuestion,
			intervalMilis,
			bot,
			channel,
			questions,
			quizId,
			term
		);
	}
}

export async function postPoll(pollId: string) {
	const channel = await getChannel();
	const poll = await getPollById(pollId);

	if (!channel) {
		throw new Error('Channel isn\'t set');
	}
	if (!poll) {
		throw new Error('Quiz wasn\'t found');
	}

	const bot = Bot.getBot();

	const { answerTime, image, answers } = poll;

	const answerTimeMilis = answerTime
		? answerTime * 1e3
		: ONE_YEAR_MILIS;

	const term = Date.now() + answerTimeMilis;
	const keyboard = getPollAnswersKeyboard(
		answers,
		{
			term,
			id: pollId
		}
	);

	await bot.telegram.sendPhoto(channel.chatId, image, {
		reply_markup: keyboard
	});
}
import Bot from '../';
import Channel from '../models/channel';
import QuizStatusType from '../../enums/QuizStatusType';
import AnswerType from '../../enums/AnswerType';
import { getAnswersKeyboard } from './keyboards';
import { getQuizIntroMessage } from './messages';
import { countWinnersByQuizId, updateQuizResultSuccessByFilter } from '../../helpers/quizResults';
import { getPollById } from '../../helpers/polls';
import { getQuizById, updateQuizStatus } from '../../helpers/quizes';

const Markup = require('telegraf/markup');

const DEFAULT_FLAG = true;
const TIMEOUT_AFTER_INTRO = 30 * 1e3; // 30 sec

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

export async function postNextQuizQuestion(bot, channel, questions, quizId, prevTerm?) {
	if (!questions.length) {
		await updateQuizResultSuccessByFilter(
			{
				quizId,
				success: true,
				lastAnswerTerm: { $lt: prevTerm }
			},
			false
		);
		await updateQuizStatus(quizId, QuizStatusType.FINISHED);
		const numberOfWinners = await countWinnersByQuizId(quizId);
		const message = `Викторина <b>завершена</b>! Количество победителей: ${numberOfWinners} пользователей`;
		await bot.telegram.sendMessage(channel.chatId, message, {
			parse_mode: 'HTML'
		});
	} else {
		const quiz = await getQuizById(quizId);
		const { answerTime, interval } = quiz;
		const answerTimeMilis = answerTime * 1e3;
		const intervalMilis = interval * 1e3;

		const question = questions.shift();
		const term = await postQuestion(
			bot,
			channel,
			{
				question,
				answerTimeMilis,
				answerType: AnswerType.QUIZ_ANSWER,
				id: quizId,
				prevTerm
			}
		);
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

export async function postQuestion(bot, channel, params: {
	question: any,
	answerTimeMilis: number,
	answerType: AnswerType,
	id: string,
	prevTerm?: number
}) {
	const { question, answerTimeMilis, answerType, id, prevTerm } = params;
	const { image, answers } = question;

	if (!image || !answers || !answers.length) {
		throw new Error("Invalid question data");
	}

	const term = Date.now() + answerTimeMilis;
	const keyboard = getAnswersKeyboard(answers, term, answerType, id, prevTerm);

	await bot.telegram.sendPhoto(channel.chatId, image, {
		reply_markup: keyboard
	});

	return term;
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

	const answerTimeMilis = answerTime * 1e3;

	await postQuestion(
		bot,
		channel,
		{
			question: {
				image,
				answers
			},
			answerTimeMilis,
			answerType: AnswerType.POLL_ANSWER,
			id: pollId
		},
	);
}
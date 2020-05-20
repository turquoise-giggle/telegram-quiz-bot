import Bot from '../';
import Channel from '../models/channel';
import { IQuiz } from '../../models/quiz';
import QuizStatusType from '../../enums/QuizStatusType';
import AnswerType from '../../enums/AnswerType';
import { getAnswersKeyboard } from './keyboards';
import { getQuizIntroMessage } from './messages';
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

	const { name, prize, answerTime, questions } = quiz;

	const quizIntroMessage = getQuizIntroMessage(name, prize, answerTime);

	console.log(quizIntroMessage);

	await bot.telegram.sendMessage(channel.chatId, quizIntroMessage, {
		parse_mode: 'HTML'
	});

	const answerTimeMilis = answerTime * 1e3;

	setTimeout(
		postNextQuizQuestion,
		TIMEOUT_AFTER_INTRO,
		bot,
		channel,
		answerTimeMilis,
		questions,
		quizId
	);
}

export async function postNextQuizQuestion(bot, channel, answerTimeMilis, questions, quizId) {
	const question = questions.shift();
	await postQuizQuestion(bot, channel, question);
	if (questions.length) {
		setTimeout(
			postNextQuizQuestion,
			answerTimeMilis,
			bot,
			channel,
			answerTimeMilis,
			questions,
			quizId
		);
	} else {
		await updateQuizStatus(quizId, QuizStatusType.FINISHED);
	}
}

export async function postQuizQuestion(bot, channel, question) {
	const { image, answers } = question;

	/*console.log('Post new question:');
	console.dir({ image, answers });*/

	if (!image || !answers || !answers.length) {
		throw new Error("Invalid question data");
	}

	const keyboard = getAnswersKeyboard(answers, AnswerType.QUIZ_ANSWER);

	await bot.telegram.sendPhoto(channel.chatId, image, {
		reply_markup: keyboard
	});
}
import { Markup } from 'telegraf';
import AnswerType from '../../enums/AnswerType';

export function getAnswersKeyboard(answers, answerTimeMilis: number, answerType: AnswerType) {
	const term = Date.now() + answerTimeMilis;
	const validCallback = answerType === AnswerType.QUIZ_ANSWER
		? `validQuiz>${term}`
		: `validPoll>${term}`;
	const invalidCallback = answerType === AnswerType.QUIZ_ANSWER
		? `invalidQuiz>${term}`
		: `invalidPoll>${term}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2});
}
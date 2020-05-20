import { Markup } from 'telegraf';
import AnswerType from '../../enums/AnswerType';

export function getAnswersKeyboard(answers, answerType: AnswerType) {
	const now = Date.now();
	const validCallback = answerType === AnswerType.QUIZ_ANSWER
		? `validQuiz>${now}`
		: `validPoll>${now}`;
	const invalidCallback = answerType === AnswerType.QUIZ_ANSWER
		? `invalidQuiz>${now}`
		: `invalidPoll>${now}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2});
}
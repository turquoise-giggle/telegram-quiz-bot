import { Markup } from 'telegraf';
import AnswerType from '../../enums/AnswerType';

export function getAnswersKeyboard(answers, answerTimeMilis: number, answerType: AnswerType, id: string) {
	const term = Date.now() + answerTimeMilis;
	const validCallback = answerType === AnswerType.QUIZ_ANSWER
		? `validQuiz>id>${term}`
		: `validPoll>id>${term}`;
	const invalidCallback = answerType === AnswerType.QUIZ_ANSWER
		? `invalidQuiz>id>${term}`
		: `invalidPoll>id>${term}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2});
}
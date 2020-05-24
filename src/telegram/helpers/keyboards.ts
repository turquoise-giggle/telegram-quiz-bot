import { Markup } from 'telegraf';
import AnswerType from '../../enums/AnswerType';

export function getAnswersKeyboard(answers, term: number, answerType: AnswerType, id: string, prevTerm: number = 0) {
	const validCallback = answerType === AnswerType.QUIZ_ANSWER
		? `validQuiz>id>${term}>${prevTerm}`
		: `validPoll>id>${term}`;
	const invalidCallback = answerType === AnswerType.QUIZ_ANSWER
		? `invalidQuiz>id>${term}>${prevTerm}`
		: `invalidPoll>id>${term}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2});
}
import { Markup } from 'telegraf';

export function getPollAnswersKeyboard(
	answers,
	params: {
		term: number,
		id: string
	}
) {
	const { term, id } = params;
	const validCallback = `validPoll>${id}>${term}`;
	const invalidCallback = `invalidPoll>${id}>${term}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2 });
}

export function getQuizAnswersKeyboard(
	answers,
	params: {
		term: number,
		id: string,
		prevTerm: number,
		questionCounter: number
	}
) {
	const { term, id, prevTerm, questionCounter } = params;
	const validCallback = `vQ>${id}>${term}>${prevTerm}>${questionCounter}`;
	const invalidCallback = `invQ>${id}>${term}>${prevTerm}>${questionCounter}`;
	const buttons = answers.map((answer) => {
		return Markup.callbackButton(
			answer.text,
			answer.isValid ? validCallback : invalidCallback
		);
	});
	return Markup.inlineKeyboard(buttons, { columns: 2 });
}
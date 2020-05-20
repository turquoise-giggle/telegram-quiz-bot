export function getQuizIntroMessage(
	name: string,
	prize: string,
	answerTime: number
) {
	const message =
		`Викторина <b>"${name}"</b>\n` +
		`Приз: <b>${prize}</b>\n` +
		`Время на ответ: <b>${answerTime} секунд</b>`;
	return message;
}
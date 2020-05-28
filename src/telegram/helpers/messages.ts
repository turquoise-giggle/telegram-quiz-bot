export function getQuizMessage(
	quiz
) {
	let message = `Викторина <b>"${quiz.name}"</b>\n`;
	for (const question of quiz.questions) {
		for (const answer of question.answers) {
			if (answer.isValid) {
				message += `Правильный ответ: ${answer.text}`;
			}
		}
	}
	return message;
}

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
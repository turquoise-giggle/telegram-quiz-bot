import QuizResult, { IQuizResult } from '../models/quizResult';

export async function getQuizResults(filter = {}) {
	return QuizResult.find(filter);
}

export async function countWinnersByQuizId(quizId: string) {
	return QuizResult.countDocuments({
		quizId,
		success: true
	});
}

export async function getQuizResultsByQuizId(quizId: string) {
	return getQuizResults({ quizId });
}

export async function getQuizResult(quizId: string, userId: number) {
	return QuizResult.findOne({ quizId, userId });
}

export async function updateQuizResultSuccess(quizId: string, userId: number, lastAnswerTerm: number, success: boolean) {
	await QuizResult.findOneAndUpdate({ quizId, userId }, { lastAnswerTerm, success }, { new: true, upsert: true });
}

export async function deleteQuizResult(quizId: string, userId: number) {
	await QuizResult.deleteOne({ quizId, userId });
}

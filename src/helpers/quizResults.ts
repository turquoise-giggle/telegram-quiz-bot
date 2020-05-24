import QuizResult, { IQuizResult } from '../models/quizResult';

export async function addQuizResult(quizResultData: IQuizResult) {
	const quizResult = new QuizResult(quizResultData);
	return quizResult.save();
}

export async function getQuizResults(filter = {}) {
	return QuizResult.find(filter);
}

export async function getQuizResultsByQuizId(quizId: string) {
	return getQuizResults({ quizId });
}

export async function getQuizResult(quizId: string, userId: string) {
	return QuizResult.findOne({ quizId, userId });
}

export async function updateQuizResultSuccess(quizId: string, userId: string, lastAnswerTerm: number, success: boolean) {
	await QuizResult.findOneAndUpdate({ quizId, userId }, { lastAnswerTerm, success }, { new: true, upsert: true });
}

export async function deleteQuizResult(quizId: string, userId: string) {
	await QuizResult.deleteOne({ quizId, userId });
}

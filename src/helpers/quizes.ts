import Quiz, { IQuiz } from '../models/quiz';
import QuizStatusType from '../enums/QuizStatusType';

export async function addQuiz(quizData: IQuiz) {
	const quiz = new Quiz(quizData);
	return quiz.save();
}

export async function getQuizes(filter = {}) {
	return Quiz.find(filter);
}

export async function getQuizById(id: string) {
	return Quiz.findById(id);
}

export async function updateQuiz(
	id: string,
	quizData: {
		name?: string;
		prize?: string;
		answerTime?: number;
		questions?: [
			{
				image: string;
				answers: [
					{
						text: string;
						isValid?: boolean;
					}
				];
			}
		]
	}) {
	await Quiz.findOneAndUpdate({ _id: id }, quizData);
}

export async function updateQuizStatus(id: string, status: QuizStatusType) {
	await Quiz.findOneAndUpdate({ _id: id }, { status });
}

export async function deleteQuiz(id: string) {
	await Quiz.deleteOne({ _id: id });
}

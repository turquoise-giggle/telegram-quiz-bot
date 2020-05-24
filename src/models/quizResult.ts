import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizResult {
	quizId: string;
	userId: string;
	success: boolean;
	lastAnswerTerm: number;
}

export interface IMongooseQuizResult extends IQuizResult, Document {}

// Схема пользователя
export const QuizResultSchema: Schema = new Schema({
	quizId: { type: String, required: true },
	userId: { type: String, required: true },
	success: { type: Boolean, required: true },
	lastAnswerTerm: { type: Number, required: true }
});

const QuizResultModel = mongoose.model<IMongooseQuizResult>('QuizResult', QuizResultSchema);

export default QuizResultModel;

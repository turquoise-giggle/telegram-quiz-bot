import mongoose, { Document, Schema } from 'mongoose';
import QuizStatusType from '../enums/QuizStatusType';

export interface IQuiz {
	name: string;
	prize: string;
	status?: QuizStatusType;
	answerTime: number;
	interval: number;
	questions: [
		{
			image: string;
			answers: [
				{
					text: string;
					isValid?: boolean;
				}
			];
		}
	];
}

export interface IMongooseQuiz extends IQuiz, Document {}

// Схема пользователя
export const QuizSchema: Schema = new Schema({
	name: { type: String, required: true },
	prize: { type: String, required: true },
	status: {
		type: Number,
		required: true,
		default: () => QuizStatusType.IN_PROCESS
	},
	answerTime: { type: Number, required: true },
	interval: { type: Number, required: true },
	questions: {
		type: [
			{
				image: { type: String, required: true },
				answers: [
					{
						text: { type: String, required: true },
						isValid: { type: Boolean }
					}
				]
			}
		]
	}
});

const QuizModel = mongoose.model<IMongooseQuiz>('Quiz', QuizSchema);

export default QuizModel;

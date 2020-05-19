import mongoose, { Document, Schema } from 'mongoose';
import QuizStatusType from '../enums/QuizStatusType';

export interface IQuiz extends Document {
	name: string;
	prize: string;
	status: QuizStatusType;
	answerTime: number;
	questions: [
		{
			image: Buffer;
			answers: [
				{
					text: string;
					isValid?: boolean;
				}
			];
		}
	];
}

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
	questions: {
		type: [
			{
				image: { type: Buffer, required: true },
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

const QuizModel = mongoose.model<IQuiz>('Quiz', QuizSchema);

export default QuizModel;

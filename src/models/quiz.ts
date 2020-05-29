import mongoose, { Document, Schema } from 'mongoose';
import QuizStatusType from '../enums/QuizStatusType';
import {
	VALID_ANSWER_QUIZ_DEFAULT,
	INVALID_ANSWER_QUIZ_DEFAULT
} from '../helpers/quizes';

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
			texts: {
				validAnswer: string;
				invalidAnswer: string;
			};
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
				],
				texts: {
					type: {
						validAnswer: String,
						invalidAnswer: String
					},
					required: true,
					default: {
						validAnswer: { type: String, required: true, default: () => VALID_ANSWER_QUIZ_DEFAULT },
						invalidAnswer: { type: String, required: true, default: () => INVALID_ANSWER_QUIZ_DEFAULT }
					}
				}
			}
		]
	}
});

const QuizModel = mongoose.model<IMongooseQuiz>('Quiz', QuizSchema);

export default QuizModel;

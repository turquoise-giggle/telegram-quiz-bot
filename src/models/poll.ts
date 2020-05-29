import mongoose, { Document, Schema } from 'mongoose';
import {
	VALID_ANSWER_POLL_DEFAULT,
	INVALID_ANSWER_POLL_DEFAULT
} from '../helpers/polls';

export interface IPoll {
	answerTime?: number;
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
	priority?: number;
}

export interface IMongoosePoll extends IPoll, Document {}

// Схема пользователя
export const PollSchema: Schema = new Schema({
	answerTime: { type: Number },
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
			validAnswer: { type: String, required: true, default: () => VALID_ANSWER_POLL_DEFAULT },
			invalidAnswer: { type: String, required: true, default: () => INVALID_ANSWER_POLL_DEFAULT }
		}
	},
	priority: { type: Number }
});

const PollModel = mongoose.model<IMongoosePoll>('Poll', PollSchema);

export default PollModel;

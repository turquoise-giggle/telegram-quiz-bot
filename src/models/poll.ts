import mongoose, { Document, Schema } from 'mongoose';
import PollStatusType from '../enums/PollStatusType';

export interface IPoll {
	status?: PollStatusType;
	answerTime: number;
	image: string;
	answers: [
		{
			text: string;
			isValid?: boolean;
		}
	];
	priority?: number;
}

export interface IMongoosePoll extends IPoll, Document {}

// Схема пользователя
export const PollSchema: Schema = new Schema({
	status: {
		type: Number,
		required: true,
		default: () => PollStatusType.WAITING
	},
	answerTime: { type: Number, required: true },
	image: { type: String, required: true },
	answers: [
		{
			text: { type: String, required: true },
			isValid: { type: Boolean }
		}
	],
	priority: { type: Number, required: true }
});

const PollModel = mongoose.model<IMongoosePoll>('Poll', PollSchema);

export default PollModel;

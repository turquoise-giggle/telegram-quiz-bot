import mongoose, { Document, Schema } from 'mongoose';

export interface IPoll {
	answerTime?: number;
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
	answerTime: { type: Number },
	image: { type: String, required: true },
	answers: [
		{
			text: { type: String, required: true },
			isValid: { type: Boolean }
		}
	],
	priority: { type: Number }
});

const PollModel = mongoose.model<IMongoosePoll>('Poll', PollSchema);

export default PollModel;

import mongoose, { Document, Schema } from 'mongoose';

export interface IPollResult {
	userId: number;
	pollId: string;
	timestamp: number;
	success: boolean;
}

export interface IMongoosePollResult extends IPollResult, Document {}

// Схема пользователя
export const PollResultSchema: Schema = new Schema({
	userId: { type: Number, required: true },
	pollId: { type: String, required: true },
	timestamp: {
		type: Number,
		required: true,
		default: () => Date.now()
	},
	success: { type: Boolean, required: true }
});

const PollResultModel = mongoose.model<IMongoosePollResult>('PollResult', PollResultSchema);

export default PollResultModel;

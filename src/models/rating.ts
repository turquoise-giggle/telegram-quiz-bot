import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
	chatId: number;
	correctAnswers: number[];
}

// Схема пользователя
export const RatingSchema: Schema = new Schema({
	chatId: { type: Number, required: true, unique: true },
	correctAnswers: {
		type: [{
			poll: { type: String, required: true },
			timestamp: { type: Number, required: true }
		}],
		required: true,
		default: () => []
	}
});

const RatingModel = mongoose.model<IRating>('Rating', RatingSchema);

export default RatingModel;

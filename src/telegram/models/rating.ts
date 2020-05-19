import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
	chatId: number;
	correctAnswers: number[];
}

// Схема пользователя
export const RatingSchema: Schema = new Schema({
	chatId: { type: Number, required: true, unique: true },
	correctAnswers: {
		type: [Number],
		required: true,
		default: () => []
	}
});

const RatingModel = mongoose.model<IRating>('Rating', RatingSchema);

export default RatingModel;

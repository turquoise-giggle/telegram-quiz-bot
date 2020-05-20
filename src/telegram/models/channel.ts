import mongoose, { Document, Schema } from 'mongoose';

export interface IChannel {
	flag: boolean;
	chatId: number;
}

interface MongooseIChannel extends IChannel, Document {}

const ChannelSchema: Schema = new Schema({
	flag: { type: Boolean, required: true, unique: true },
	chatId: { type: Number, required: true, unique: true }
});

export default mongoose.model<MongooseIChannel>('Channel', ChannelSchema);

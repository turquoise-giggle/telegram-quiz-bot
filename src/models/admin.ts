import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin {
	username: string;
	password: string;
}

export interface IMongooseAdmin extends IAdmin, Document {}

// Схема пользователя
export const AdminSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, unique: true }
});

const Admin = mongoose.model<IMongooseAdmin>('Admin', AdminSchema);
export default Admin;

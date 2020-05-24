import mongoose, { Document, Schema } from 'mongoose';

const Any = Schema.Types.Mixed;

export interface IVar {
	name: string;
	value: any
}

interface MongooseIVar extends IVar, Document {}

const VarSchema: Schema = new Schema({
	name: { type: String, required: true, unique: true },
	value: { type: Any, required: true }
});

const VarModel = mongoose.model<MongooseIVar>('Var', VarSchema);
export default VarModel;

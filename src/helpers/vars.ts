import VarModel, { IVar } from '../models/vars';

export async function getVars(filter = {}) {
	return VarModel.find(filter);
}

export async function getVar(name: string) {
	return VarModel.findOne({ name });
}

export async function createVar(doc: IVar) {
	const variable = new VarModel(doc);

	try {
		await variable.save();
	}
	catch(err) {
		if (err.code === 11000) {
			console.error('Duplicating var');
		}
		else console.error(err);
	}
}


export async function updateVar(name: string, value: any) {
	return VarModel.findOneAndUpdate({ name }, { value }, { upsert: true, new: true });
}

export async function deleteVar(name: string) {
	return VarModel.deleteOne({ name });
}

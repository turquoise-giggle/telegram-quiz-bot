import { getVar, updateVar } from '../helpers/vars';

const Texts = {
	getText: async function(name: string) {
		const { value } = await getVar(name);
		return value;
	},
	setText: async function(name: string, value: string) {
		return updateVar(name, value);
	}
};

export default Texts;

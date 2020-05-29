import { getVar, updateVar } from '../helpers/vars';

const Texts = {
	getText: async function(name: string) {
		const text = await getVar(name);
		return text ? text.value : 'n/a';
	},
	setText: async function(name: string, value: string) {
		return updateVar(name, value);
	}
};

export default Texts;

import Daemon from '../../daemon/daemon';
import Texts from '../../texts/texts';
import { getVar } from '../../helpers/vars';
import { bufferToStream } from '../../helpers/functions';
import { postPoll } from '../../telegram/helpers/channel';
import {
	getPollResultsTableToday,
	getPollResultsTableCurrentWeek
} from '../../helpers/excel';
import {
	addPoll,
	getPolls,
	updatePoll,
	deletePoll
} from '../../helpers/polls';

const handlers = {
	read: async (ctx) => {
		const { id } = ctx.query;
		if (!id) {
			return (ctx.status = 400);
		}
		try {
			const value = await Texts.getText(id);
			ctx.status = 200;
			ctx.body = {
				value
			};
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
	},
	update: async (ctx) => {
		const {
			id,
			value
		} = ctx.request.body;
		if (!id || !value) {
			return (ctx.status = 400);
		}
		try {
			await Texts.setText(id, value);
			ctx.status = 200;
			ctx.body = {
				id
			};
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
	}
};

export default handlers;

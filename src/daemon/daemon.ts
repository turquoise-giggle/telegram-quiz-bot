import PollStatusType from '../enums/PollStatusType';
import { getVar, updateVar } from '../helpers/vars';
import { postPoll } from '../telegram/helpers/channel';
import { getPollsForPost, deletePoll, updatePollStatus } from '../helpers/polls';

const DEFAULT_POST_NEW_POLLS_INTERVAL = 60 * 1e3; // 30 min

const Daemon = {
	postNewPollsInterval: null,
	postNewPolls: async function() {
		const polls = await getPollsForPost();
		for (const poll of polls) {
			await postPoll(poll._id);
			await updatePollStatus(poll._id, PollStatusType.POSTED);
		}
	},
	init: async function() {
		this.postNewPollsInterval = setInterval(this.postNewPolls, DEFAULT_POST_NEW_POLLS_INTERVAL);
		console.log('>>> Daemon инициализирован');
	}
};

export default Daemon;

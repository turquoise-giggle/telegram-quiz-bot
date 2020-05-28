import { getVar, updateVar } from '../helpers/vars';
import { getHighestPriorityPoll, deletePoll } from '../helpers/polls';
import { postPoll } from '../telegram/helpers/channel';

const DEFAULT_POST_NEW_POLL_INTERVAL = 30 * 60 * 1e3; // 30 min

const Daemon = {
	postNewPollInterval: null,
	postNewPoll: async function() {
		const poll = await getHighestPriorityPoll();
		if (!poll) { return; }
		await postPoll(poll._id);
		await deletePoll(poll._id);
	},
	init: async function() {
		const postNewPollIntervalVar =
			await getVar('postNewPollInterval') ||
			await updateVar('postNewPollInterval', DEFAULT_POST_NEW_POLL_INTERVAL);

		const intervalTimeMilis = postNewPollIntervalVar.value * 1e3;
		
		this.postNewPollInterval = setInterval(this.postNewPoll, intervalTimeMilis);

		console.log('>>> Daemon инициализирован');
	},
	setPostNewPollIntervalTime: async function(intervalTime: number) {
		await updateVar('postNewPollInterval', intervalTime);
		const intervalTimeMilis = intervalTime * 1e3;
		clearInterval(this.postNewPollInterval);
		this.postNewPollInterval = setInterval(this.postNewPoll, intervalTimeMilis);
	}
};

export default Daemon;

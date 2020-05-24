import { } from '../helpers/polls';

const DEFAULT_POST_NEW_POLL_INTERVAL = 30 * 60 * 1e3; // 30 min

const Daemon = {
	interval: null,
	postNewPoll: async function() {
		//...
	},
	init: function() {
		this.interval = setInterval(this.postNewPoll, DEFAULT_POST_NEW_POLL_INTERVAL);
	}
};

export default Daemon;

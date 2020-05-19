import Poll, { IPoll } from '../models/poll';
import PollStatusType from '../enums/PollStatusType';

export async function addPoll(pollData: IPoll) {
	const poll = new Poll(pollData);
	return poll.save();
}

export async function getPolls(filter = {}) {
	return Poll.find(filter);
}

export async function getPollById(id: string) {
	return Poll.findById(id);
}

export async function updatePoll(
	id: string,
	pollData: {
		image?: string,
		answers?: [
			{
				text: string;
				isValid?: boolean;
			}
		],
		answerTime?: number
	}) {
	return Poll.findOneAndUpdate({ _id: id }, pollData);
}

export async function updatePollStatus(id: string, status: PollStatusType) {
	await Poll.findOneAndUpdate({ _id: id }, { status });
}

export async function deletePoll(id: string) {
	return Poll.deleteOne({ _id: id });
}

export async function getHighestPriorityPoll() {
	const polls = await getPolls();
	
	let index = 0;
	let maxPriority = 0;
	for (let i = 0; i < polls.length; i++) {
		if (polls[i].priority > maxPriority) {
			maxPriority = polls[i].priority;
			index = i;
		}
	}

	return polls[index];
}
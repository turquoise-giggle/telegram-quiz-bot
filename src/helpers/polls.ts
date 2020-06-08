import Poll, { IPoll } from '../models/poll';
import PollStatusType from '../enums/PollStatusType';

export const VALID_ANSWER_POLL_DEFAULT = 'Выбран верный ответ ✅';
export const INVALID_ANSWER_POLL_DEFAULT = 'Выбран неверный ответ ❌';

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
	return Poll.findOneAndUpdate({ _id: id }, { status });
}

export async function deletePoll(id: string) {
	return Poll.deleteOne({ _id: id });
}

export async function getPollsForPost() {
	const polls = await getPolls({
		postTime: {
			$lte: Date.now()
		},
		status: PollStatusType.WAITING
	});
	return polls;
}

export function getStatusTypeTexts() {
	const texts = {};
	texts[PollStatusType.WAITING] = 'Ожидает';
	texts[PollStatusType.POSTED] = 'Пост выпущен';
	return texts;
}
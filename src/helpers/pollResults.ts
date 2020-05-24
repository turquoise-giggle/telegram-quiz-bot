import PollResult, { IPollResult } from '../models/pollResult';

export async function getPollResults(filter = {}) {
	return PollResult.find(filter);
}

export async function getPollResultsByPollId(pollId: string) {
	return getPollResults({ pollId });
}

export async function getPollResult(pollId: string, userId: number) {
	return PollResult.findOne({ pollId, userId });
}

export async function updatePollResultSuccess(pollId: string, userId: number, success: boolean) {
	await PollResult.findOneAndUpdate({ pollId, userId }, { success }, { new: true, upsert: true });
}

export async function deletePollResult(pollId: string, userId: number) {
	await PollResult.deleteOne({ pollId, userId });
}
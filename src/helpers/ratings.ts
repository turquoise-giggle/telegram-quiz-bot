import Rating, { IRating } from '../models/rating';

export async function addRating(chatId: number) {
	const rating = new Rating({ chatId });
	await rating.save();
}

export async function getRatings(filter = {}) {
	return Rating.find(filter);
}

export async function getRatingByChatId(chatId: number) {
	return Rating.findOne({ chatId });
}

export async function addCorrectAnswer(chatId: number) {
	const rating = await getRatingByChatId(chatId);
	rating.correctAnswers.push(Date.now());
	await rating.save();
}

export async function getTodayRating() {
	const ratings = await getRatings();
	/**/
}

export async function getWeekRating() {
	const ratings = await getRatings();
	/**/
}
import XlsxPopulate from 'xlsx-populate';
import { IQuizResult } from '../models/quizResult';
import { IPollResult } from '../models/pollResult';
import { getQuizResultsByQuizId } from './quizResults';
import { getPollResults } from './pollResults';
import { getUserByChatId } from '../telegram/helpers/functions';

const QUIZ_RESULTS_HEADER = [
	'Юзернейм',
	'Имя пользователя'
];
const POLL_RESULTS_HEADER = [
	'Юзернейм',
	'Имя пользователя',
	'Правильных ответов'
];

export async function getQuizResultsTable(quizId: string) {
	const quizResults = await getQuizResultsByQuizId(quizId);

	const resultsData = [];

	for (const quizResult of quizResults) {
		const { userId, success } = quizResult;
		
		if (!success) { continue; }
		
		const user = await getUserByChatId(userId);

		if (!user) {
			continue;
		}

		const username = `@${user.username}` || '-';
		const name = user.name || '-';
		
		resultsData.push([username, name]);
	}

	if (!resultsData.length) {
		resultsData.push(['-', '-']);
	}

	const workbook = await XlsxPopulate.fromBlankAsync();
	
	workbook
		.activeSheet()
		.name('Результаты викторины');

	workbook
		.activeSheet()
		.cell('A1')
		.value([QUIZ_RESULTS_HEADER]);

	for (let i = 0; i < QUIZ_RESULTS_HEADER.length; i++) {
		workbook
			.activeSheet()
			.column(i + 1)
			.width(25);
	}

	workbook
		.activeSheet()
		.cell('A2')
		.value(resultsData);

	return workbook.outputAsync();
}

export async function getPollResultsTableSince(since: number) {
	const pollResults = await getPollResults({
		timestamp: { $gte: since }
	});

	const results = {};

	for (const pollResult of pollResults) {
		const { userId, success } = pollResult;

		if (!success) { continue; }
		
		results[userId] = results[userId]
			? results[userId] + 1
			: 1;
	}

	const resultsData = [];

	for (const userId in results) {
		const user = await getUserByChatId(parseInt(userId));

		if (!user) {
			continue;
		}

		const username = `@${user.username}` || '-';
		const name = user.name || '-';
		const result = results[userId];
		
		resultsData.push([username, name, result]);
	}

	if (!resultsData.length) {
		resultsData.push(['-', '-', '-']);
	}

	const workbook = await XlsxPopulate.fromBlankAsync();
	
	workbook
		.activeSheet()
		.name('Рейтинг по опросам');

	workbook
		.activeSheet()
		.cell('A1')
		.value([POLL_RESULTS_HEADER]);

	for (let i = 0; i < POLL_RESULTS_HEADER.length; i++) {
		workbook
			.activeSheet()
			.column(i + 1)
			.width(25);
	}

	workbook
		.activeSheet()
		.cell('A2')
		.value(resultsData);

	return workbook.outputAsync();
}

export async function getPollResultsTableToday() {
	const today = new Date().setHours(0, 0, 0, 0);
	return getPollResultsTableSince(today);
}

export async function getPollResultsTableCurrentWeek() {
	const current = new Date();
	const firstDayOfWeek = new Date(
		current.setDate(current.getDate() - current.getDay() + 1)
	).setHours(0, 0, 0, 0);
	return getPollResultsTableSince(firstDayOfWeek);
}
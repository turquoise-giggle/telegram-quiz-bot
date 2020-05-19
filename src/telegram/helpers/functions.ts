import fs from 'fs';
import path from 'path';
import { ContextMessageUpdate } from 'telegraf';
import { promisify } from 'util';
import User, { IUser } from '../models/user';

/**
 * Получает список пользователей
 * @async
 * @function getUsers
 * @returns { Promise<IUser[]> }
 */
export const getUsers = async (): Promise<IUser[]> => User.find({});

/**
 * Получает список админов
 * @async
 * @function getAdmins
 * @returns { Promise<IUser[]> }
 */
export const getAdmins = async (): Promise<IUser[]> => User.find({ isAdmin: true });

/**
 * Проверяет является ли пользователь админом
 * @async
 * @function isAdmin
 * @param chatId
 * @returns { Promise<Boolean> }
 */
export const isAdmin = async (chatId: number): Promise<Boolean> => {
	let res = await User.find({ chatId: chatId, isAdmin: true });
	return res.length > 0;
};

/**
 * Проводит глобальную рассылку
 * @async
 * @function sendGlobal
 * @param ctx
 * @param filters
 * @returns { Promise<void> }
 */
export const sendGlobal = async (ctx, filters = {}) => {
	const users = await User.find(filters);

	for (const user of users) {
		if (user.chatId !== ctx.from.id) {
			try {
				await ctx.telegram.sendCopy(user.chatId, ctx.message);
			} catch (err) {
				console.error(`Не удалось выполнить рассылку пользователю: ${err.message}`);
			}
		}
	}
};

/**
 * Добавляет нового админа
 * @async
 * @function addAdmin
 * @param chatId
 * @returns { Promise<void> }
 */
export const addAdmin = async (chatId: number) => {
	try {
		const user = await User.findOne({ chatId: chatId });
		user.isAdmin = true; // делаем юзера админом

		// Сохраняем его
		try {
			await user.save();
			console.log('Добавлен новый админ!');
		} catch (e) {
			throw e;
		}
	} catch (err) {
		throw new Error(`Ошибка при добавлении админа: ${err.message}`);
	}
};

/**
 * Отстраняет админа
 * @async
 * @function dismissAdmin
 * @param chatId
 * @returns { Promise<void> }
 */
export const dismissAdmin = async (chatId: number) => {
	try {
		await User.updateOne({ chatId: chatId }, { isAdmin: false });
		console.log('Админ успешно отстранён!');
	} catch (err) {
		throw new Error(`Ошибка при отстранении админа: ${err.message}`);
	}
};

/**
 * Возвращает все файлы в папке рекурсивно
 * @async
 * @function getFilesRecursively
 * @returns { Promise<string[]> }
 * @param dir
 * @param fileList
 */
export const getFilesRecursively = async (dir, fileList = null): Promise<string[]> => {
	const files = await promisify(fs.readdir)(dir);

	fileList = fileList || [];
	for (const file of files) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			fileList = await getFilesRecursively(dir + file + '/', fileList);
		} else {
			fileList.push(dir + file);
		}
	}

	return fileList;
};

/**
 * Имитирует набор сообщения
 * @async
 * @function imitateTyping
 * @param ctx
 * @param seconds
 * @returns { Promise<void> }
 */
export const imitateTyping = async (ctx: ContextMessageUpdate, seconds = 1) => {
	return new Promise((resolve) => {
		ctx.replyWithChatAction('typing');
		setTimeout(resolve, seconds * 1000);
	});
};

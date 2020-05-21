import AdminMessage from '../../controllers/admin';
import IScene from '../../typings/scene';
import { setChannel } from '../../helpers/channel';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('editChannel');

scene.backScene = AdminMessage;
scene.nextScene = AdminMessage;

// Точка входа в сцену
scene.enter(async (ctx: any) => {
	const keyboard = scene.backInlineKeyboard;
	await ctx.replyWithMarkdown('Перешлите мне сообщение с нового канала ⏩', keyboard.extra());
});

scene.on('message', async (ctx: any) => {
	await ctx.scene.leave();
	try {
		const chatId = ctx.message.forward_from_chat.id;
		await ctx.telegram.sendMessage(chatId, 'Здравствуйте! Сюда я буду выкладывать викторины и опросы');
		await setChannel(chatId);
		await scene.next(ctx, 'Операция прошла успешно! 🎉');
	} catch (err) {
		console.error(err.message);
		await scene.next(
			ctx,
			'Не удалось изменить канал, приносим извинения.\nВозможно, Вы ввели некорректные данные'
		);
	}
});

export default scene;

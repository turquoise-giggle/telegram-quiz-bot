/**
 * Прослойка для логирования переписки
 * @async
 */
export default (ctx, next) => {
	try {
		// Получаем данные о пользователе из контекста
		let username = ctx.from.username;
		let name = ctx.from.first_name;

		// Составляем имя в зависимости от наличия фамилии
		if (ctx.from.last_name !== undefined) {
			name = `${ctx.from.first_name} ${ctx.from.last_name}`;
		}

		// Логируем сообщение
		if (ctx.updateType === 'callback_query') {
			if (username !== undefined) {
				console.log(`${name} (@${username}) выбрал(а): "${ctx.callbackQuery.data}"`);
			} else {
				console.log(`${name} выбрал(а): "${ctx.callbackQuery.data}"`);
			}
		} else if (ctx.updateType === 'message') {
			if (username !== undefined) {
				console.log(`Сообщение от ${name} (@${username}): "${ctx.message.text}"`);
			} else {
				console.log(`Сообщение от ${name}: "${ctx.message.text}"`);
			}
		} else {
			if (username !== undefined) {
				console.log(`Обновление ${ctx.updateType} от ${name} (@${username}): "${ctx.message.text}"`);
			} else {
				console.log(`Обновление ${ctx.updateType} от ${name}: "${ctx.message.text}"`);
			}
		}
	} catch {}

	next();
};

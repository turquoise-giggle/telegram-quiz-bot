import Bot from './init/bot';
import Handlers from './init/handlers';
import Middlewares from './init/middlewares';
import Prototypes from './init/prototypes';
import Scenes from './init/scenes';

const Telegram = {
	bot: null,
	init: async function() {
		if (this.bot) {
			return this.bot;
		}

		await Prototypes.init();

		this.bot = await Bot.configure(); // конфигурируем бот

		await Middlewares.init(this.bot); // инициализируем прослойки
		await Scenes.init(this.bot); // инициализируем сцены
		await Handlers.init(this.bot); // инициализируем обработчики

		console.log('=> Telegram бот инициализирован');

		return this.bot;
	},
	getBot: function() {
		return this.bot;
	}
};

export default Telegram;

import Bot from './init/bot';
import DB from './init/db';
import Handlers from './init/handlers';
import Middlewares from './init/middlewares';
import Prototypes from './init/prototypes';
import Scenes from './init/scenes';

const main = async () => {
    await DB.connect(); // подключаемся к БД
    await Prototypes.init();
    
    const bot = await Bot.configure(); // конфигурируем бот
    
    await Middlewares.init(bot);    // инициализируем прослойки
    await Scenes.init(bot);         // инициализируем сцены
    await Handlers.init(bot);       // инициализируем обработчики
};

main();

import path from 'path';
import { TelegrafMongoSession } from 'telegraf-session-mongodb';
import config from '../config';
import { getFilesRecursively } from '../helpers/functions';

const Middlewares = {
    init: async bot => {
        try {
            // Подключение всех модулей в папке ../middlewares/
            const middlewaresRoot = path.join(__dirname, '../middlewares/');
            const files = await getFilesRecursively(middlewaresRoot);
    
            files.filter(filename => path.extname(filename) === '.js' && path.basename(filename)[0] !== '_')
                 .map(file => require(file).default)
                 .forEach(middleware => bot.use(middleware));
            
            TelegrafMongoSession.setup(bot, config.dbUrl);
            
            console.log('>>> Прослойки инициализированы');
        }
        catch {
            console.error('XXX Произошла ошибка при инициализации прослоек!');
            process.exit(1); // выход из приложения
        }
    }
};

export default Middlewares;

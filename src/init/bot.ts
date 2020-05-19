import Telegraf from 'telegraf';
import config from '../config';

const Bot = {
    token: config.token,
    
    configure: async () => {
        const bot = new Telegraf(Bot.token);
        const { useWebhook, secretPath, port, tlsOptions } = config.webhook;
        
        if (useWebhook) {
            bot.startWebhook(secretPath, tlsOptions, port);
        }
        
        bot.catch(err => {
            console.error(err);
        });
        
        await bot.launch();
        
        console.log('>>> Бот сконфигурирован');
        return bot;
    }
};

export default Bot;

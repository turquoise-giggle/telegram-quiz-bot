import { Markup } from 'telegraf';

const StartMessage = {
    keyboard: Markup.keyboard([
        ['Далее ⏩']
    ]).oneTime().resize().extra(),
    
    send: async (ctx, message: string = 'Добро пожаловать!') => {
        await ctx.reply(message, StartMessage.keyboard);
    }
};

export default StartMessage;

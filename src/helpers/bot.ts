import { Bot, Context, GrammyError, HttpError } from 'grammy';
import constanst from '../config.js';
import { ChatMembersFlavor } from '@grammyjs/chat-members';

// Define custom context type.
interface BotConfig {
    botDeveloper: number;
    isDeveloper: boolean;
    botSudo: number[];
    isSudo: boolean;
    logChatId: number;
}

export type MyContext = Context &
    ChatMembersFlavor & {
        config: BotConfig;
    };

// Setup bot token
const bot = new Bot<MyContext>(constanst.BOT_TOKEN);

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', err.message);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', err.message);
    } else {
        console.error('Unknown error:', err.message);
    }
});

export default bot;

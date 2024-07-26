import { Bot, Context, GrammyError, HttpError } from 'grammy';
import constanst from '../config.js';
import { ChatMembersFlavor } from '@grammyjs/chat-members';

// Define custom context type.
interface BotConfig {
    botDeveloper: number;
    logChatId: number;
}

export type MyContext = Context &
    ChatMembersFlavor & {
        config: BotConfig;
    };

// Setup bot token
const bot = new Bot<MyContext>(constanst.BOT_TOKEN);

export default bot;

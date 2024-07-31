import type { ChatMembersFlavor } from '@grammyjs/chat-members';
import { Bot, type Context } from 'grammy';
import constanst from '../config.js';

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

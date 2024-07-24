import Group from '../models/groups.js';
import { MyContext } from './bot.js';
import { setErrorMessage } from './utils.js';

async function saveChatConfig(ctx: MyContext) {
    const admins = await ctx.getChatAdministrators();
    const currentChat = await Group.findOne({ chatId: ctx.chat?.id });

    const errorMessage = (err: any) => {
        return '[ERROR_LOG] Failed to create group DB\nError: ' + err.message;
    };

    try {
        if (!currentChat) {
            await Group.create({
                chatId: ctx.chat?.id,
                chatName: ctx.chat?.title,
                admins: admins,
            }).catch((err) => {
                ctx.api.sendMessage(ctx.config.logChatId, errorMessage(err));
            });
        }

        await Group.updateOne({ chatId: ctx.chat?.id }, { chatName: ctx.chat?.title, admins: admins }).catch((err) => {
            ctx.api.sendMessage(ctx.config.logChatId, errorMessage(err));
        });
    } catch (err) {
        await ctx.api.sendMessage(ctx.config.logChatId, setErrorMessage(err));
    }
}

export default saveChatConfig;

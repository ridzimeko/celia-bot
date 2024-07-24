import Group from '../models/groups';
import { MyContext } from './bot';

async function updateGroupStatus(ctx: MyContext) {
    const admins = await ctx.getChatAdministrators();
    const currentChat = await Group.findOne({ chatId: ctx.chat?.id });

    const errorMessage = (err: any) => {
        return '[ERROR_LOG] Failed to create admin DB\nError: ' + err.message;
    };

    await Group.updateOne(
        { chatId: ctx.chat?.id },
        {
            chatId: ctx.chat?.id,
            chatName: ctx.chat?.title,
            username: ctx.chat?.username,
        }
    ).catch((err) => {
        ctx.api.sendMessage(ctx.config.logChatId, errorMessage(err));
    });
}

export default updateGroupStatus;

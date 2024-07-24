import { Composer } from 'grammy';
import { checkAdmin } from '../helpers/adminHelper';
import { MyContext } from '../helpers/bot';

const composer = new Composer<MyContext>();

composer
    .hears(/[/]pin ?(\S+)?/)
    .chatType(['group', 'supergroup'])
    .filter(checkAdmin, async (ctx) => {
        let disableNotify = true;
        const replyMsg = ctx.message?.reply_to_message;

        try {
            if (ctx.match[1]) {
                if (ctx.match[1] === 'loud') disableNotify = false;
                else
                    return await ctx.reply('Parameter untuk pin pesan adalah *loud*', {
                        parse_mode: 'Markdown',
                    });
            }

            if (replyMsg) {
                return await ctx.pinChatMessage(replyMsg.message_id, {
                    disable_notification: disableNotify,
                });
            }

            await ctx.reply('Balas pesan untuk mengepin chat!!');
        } catch (err) {
            await ctx.reply('Ouch Terjadi error saat mengepin chat!\nError: ' + err);
        }
    });

export default composer;

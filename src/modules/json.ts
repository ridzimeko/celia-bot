import { Composer } from 'grammy';
import { setErrorMessage } from '../helpers/utils';

const composer = new Composer();

composer.command('json', async (ctx) => {
    try {
        const replyMessage = ctx.message?.reply_to_message;
        // if reply message
        if (replyMessage) {
            return await ctx.reply('```json\n' + JSON.stringify(replyMessage, null, 4) + '```', {
                parse_mode: 'MarkdownV2',
            });
        }
        /// if not reply message
        return await ctx.reply('```json\n' + JSON.stringify(ctx.message, null, 4) + '```', {
            parse_mode: 'MarkdownV2',
        });
    } catch (err) {
        await ctx.reply(setErrorMessage(err));
    }
});

export default composer;

import { Composer } from 'grammy';
import { botCanPinMessage, isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';

const composer = new Composer<MyContext>();

composer
  .chatType(['group', 'supergroup'])
  .hears(/^[\/]pin\b( .+)?/)
  .filter(isAdmin)
  .use(botCanPinMessage, async (ctx: MyContext) => {
    let disableNotify = true;
    const replyMsg = ctx.message?.reply_to_message;

    try {
      if (ctx?.match?.[1]) {
        if (ctx.match[1].trim().toLowerCase() === 'loud') disableNotify = false;
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
      await ctx.reply(`Ouch Terjadi error saat mengepin chat!\nError: ${err}`);
    }
  });

export default composer;

import { Composer } from 'grammy';
import { botCanPinMessage, isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';

const composer = new Composer<MyContext>();

composer
  .chatType(['group', 'supergroup'])
  .command('unpin')
  .filter(isAdmin)
  .use(botCanPinMessage, async (ctx: MyContext) => {
    const message_id = ctx.message?.reply_to_message?.message_id;

    try {
      if (message_id) return await ctx.unpinChatMessage(message_id);
      await ctx.reply('Balas pesan untuk melepas pin chat!');
    } catch (err) {
      await ctx.reply('Pesan yang ingin di unpin tidak ditemukan!');
    }
  });

composer
  .chatType(['group', 'supergroup'])
  .command('unpinall')
  .filter(isAdmin)
  .use(botCanPinMessage, async (ctx: MyContext) => {
    await ctx.unpinAllChatMessages();
    await ctx.reply('Semua pesan berhasil di unpin');
  });

export default composer;

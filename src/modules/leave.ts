import { Composer } from 'grammy';
import type { MyContext } from '../helpers/bot';
import { checkDeveloper } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer
  .command('leave')
  .chatType(['group', 'supergroup'])
  .filter(checkDeveloper, async (ctx) => {
    try {
      await ctx.reply('Sampai jumpa semuanya _have a nice day_', {
        parse_mode: 'Markdown',
      });
      await ctx.leaveChat();
    } catch (err) {
      await ctx.reply(`Ouch, terjadi error!\nError: ${err}`);
    }
  });

export default composer;

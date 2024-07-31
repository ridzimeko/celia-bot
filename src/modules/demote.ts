import { Composer } from 'grammy';
import { botCanPromoteUser, isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';
import { setErrorMessage } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer
  .chatType(['group', 'supergroup'])
  .command('demote')
  .filter(isAdmin)
  .use(botCanPromoteUser, async (ctx: MyContext) => {
    const user_id = ctx.message?.reply_to_message?.from?.id;

    try {
      // Reply message condition
      if (!user_id) {
        return await ctx.reply('Tidak dapat menemukan user yang di demote!');
      }
      if (user_id === ctx.me.id) {
        return await ctx.reply('Umm... saya tidak bisa demote diri saya sendiri');
      }

      const member = await ctx.getChatMember(user_id);

      // Check if bot can promote target user
      if (member.status === 'creator') {
        return await ctx.reply('Saya tidak bisa demote pemilik grup!');
      }

      await ctx.promoteChatMember(member.user.id);
      await ctx.reply(`${member.user.first_name} telah berubah status menjadi member`);
    } catch (err: any) {
      const error_message = err.description.split(' ').at(-1);

      // Bot can't demote user when promoted by other admin
      if (error_message === 'CHAT_ADMIN_REQUIRED') {
        return await ctx.reply(
          'Saya tidak bisa demote, kemungkinan pengguna dipromosikan oleh admin lain',
        );
      }
      await ctx.reply(setErrorMessage(err));
    }
  });

export default composer;

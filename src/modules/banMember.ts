import { Composer } from 'grammy';
import { botCanRestrictUser, isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';

const composer = new Composer<MyContext>();

composer
  .chatType(['group', 'supergroup'])
  .hears(/^[\/]ban\b( .+)?/)
  .filter(isAdmin)
  .use(botCanRestrictUser, async (ctx: MyContext) => {
    const user_id = ctx.message?.reply_to_message?.from?.id;
    const reason = ctx?.match?.[1]?.trim() || 'Tidak ada alasan';

    try {
      // Reply message condition
      if (!user_id) return await ctx.reply('Balas pesan ke user yang ingin di ban!');
      if (user_id === ctx.me.id)
        return await ctx.reply('Kenapa saya harus blokir diri saya sendiri?');

      const from_user = await ctx.getChatMember(user_id);

      // Check if bot can restrict target user
      if (from_user.status === 'creator')
        return await ctx.reply('Kamu serius menyuruh saya memblokir pemilik grup?');
      if (from_user.status === 'administrator')
        return await ctx.reply('Maaf, saya tidak bisa memblokir admin lain');
      if (from_user.status === 'kicked')
        return await ctx.reply('Pengguna sudah dikeluarkan dari grup');

      await ctx.banChatMember(user_id);
      await ctx.reply(
        `${from_user.user.first_name} berhasil diblokir dari grup!\nAlasan : ${reason}`,
      );
    } catch (err) {
      await ctx.reply(`Ouch, terjadi error pada saat ban pengguna!\nError: ${err}`);
    }
  });

export default composer;

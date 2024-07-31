import { Composer } from 'grammy';
import { botCanRestrictUser, isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';
import { formatUnixTime, setErrorMessage, toUnixTime } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer
  .chatType(['group', 'supergroup'])
  .command('mute')
  .filter(isAdmin)
  .use(botCanRestrictUser, async (ctx: MyContext) => {
    const [, arg1, arg2] = ctx.msg?.text?.split(/\s+/) || [];
    const reply_msg = ctx.msg?.reply_to_message;
    let until_date: number;
    let user_id: number | undefined;

    if (reply_msg) {
      until_date = toUnixTime(arg1);
      user_id = reply_msg.from?.id;
    } else {
      until_date = toUnixTime(arg2);
      user_id = Number.parseInt(arg1);
    }

    try {
      if (!user_id) return await ctx.reply('Tidak dapat menemukan user yang di bisukan');
      if (user_id === ctx.me.id)
        return await ctx.reply('Kenapa saya harus membisukan diri saya sendiri?');

      const from_user = await ctx.getChatMember(user_id);

      // Check if bot can restrict target user
      if (from_user.status === 'creator')
        return await ctx.reply('Tidak dapat membisukan pemilik grup');
      if (from_user.status === 'administrator')
        return await ctx.reply('Maaf, saya tidak bisa membisukan admin lain');
      if (from_user.status === 'restricted' && from_user.can_send_messages === false)
        return await ctx.reply('Pengguna sudah dibisukan');

      await ctx.restrictChatMember(from_user.user.id, { can_send_messages: false }, { until_date });

      if (until_date !== 0)
        await ctx.reply(
          `${from_user.user.first_name} berhasil dibisukan hingga ${formatUnixTime(until_date)}`,
        );
      else await ctx.reply(`${from_user.user.first_name} berhasil dibisukan`);
    } catch (err) {
      await ctx.reply(setErrorMessage(err));
    }
  });

export default composer;

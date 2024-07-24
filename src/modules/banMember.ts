import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanRestrictUser } from '../helpers/adminHelper';

const composer = new Composer<MyContext>();

composer.hears(
    /ban(.*)/,
    botCanRestrictUser(async (ctx: MyContext) => {
        const reply_msg = ctx.message?.reply_to_message;
        const reason = ctx?.match?.[1] || 'Tidak ada alasan';

        try {
            // Reply message condition
            if (!reply_msg) return await ctx.reply('Balas pesan ke user yang ingin di ban!');
            else if (reply_msg.from?.id === ctx.me.id) return await ctx.reply('Kenapa saya harus blokir diri saya sendiri?');

            const from_user = await ctx.chatMembers.getChatMember(ctx.chat?.id, reply_msg?.from?.id);

            // Check if bot can restrict target user
            if (from_user.status === 'creator') return await ctx.reply('Kamu serius menyuruh saya memblokir pemilik grup?');
            else if (from_user.status === 'administrator') return await ctx.reply('Maaf, saya tidak bisa memblokir admin lain');
            else if (from_user.status === 'kicked') return await ctx.reply('Pengguna sudah dikeluarkan dari grup');

            await ctx.banChatMember(reply_msg!.from!.id);
            await ctx.reply(`${reply_msg?.from?.first_name} berhasil diblokir dari grup!\nAlasan : ${reason}`);
        } catch (err) {
            await ctx.reply('Ouch, terjadi error pada saat ban pengguna!\nError: ' + err);
        }
    })
);

export default composer;

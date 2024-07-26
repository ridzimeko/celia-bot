import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanRestrictUser, isAdmin } from '../helpers/adminHelper';
import { formatTimeUnix, toUnixTime } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer
    .chatType(['group', 'supergroup'])
    .hears(/^[\/]mute\b( .+\b)?( .+)?/)
    .filter(isAdmin)
    .use(botCanRestrictUser, async (ctx: MyContext) => {
        const user_id = ctx.message?.reply_to_message?.from?.id || parseInt(ctx?.match?.[1]?.trim() || '');
        const restrict_time = toUnixTime(ctx?.match?.[1]?.trim() || ctx?.match?.[2]?.trim() || '');
        const time_until = restrict_time ? formatTimeUnix(restrict_time) : '';

        try {
            // Reply message condition
            if (!user_id) return await ctx.reply('Tidak dapat menemukan user yang di bisukan');
            if (user_id === ctx.me.id) return await ctx.reply('Kenapa saya harus membisukan diri saya sendiri?');

            const from_user = await ctx.chatMembers.getChatMember(user_id);

            // Check if bot can restrict target user
            if (from_user.status === 'creator') return await ctx.reply('Tidak dapat membisukan pemilik grup');
            if (from_user.status === 'administrator') return await ctx.reply('Maaf, saya tidak bisa membisukan admin lain');
            if (from_user.status === 'restricted') {
                if (from_user.until_date !== 0) {
                    return await ctx.reply(`Pengguna sudah dibisukan`);
                }
                return await ctx.reply(`Pengguna telah dibisukan hingga ${formatTimeUnix(from_user.until_date)}`);
            }

            await ctx.banChatMember(user_id, { until_date: restrict_time });

            if (time_until) await ctx.reply(`${from_user.user.first_name} berhasil dibisukan hingga ${time_until}`);
            else await ctx.reply(`${from_user.user.first_name} berhasil dibisukan`);
        } catch (err) {
            await ctx.reply('Ouch, terjadi error pada saat membisukan pengguna!\nError: ' + err);
        }
    });

export default composer;

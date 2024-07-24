import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanPromoteUser, checkAdmin } from '../helpers/adminHelper';

const composer = new Composer<MyContext>();

composer.command('demote').filter(
    checkAdmin,
    botCanPromoteUser(async (ctx: MyContext) => {
        const reply_msg = ctx.message?.reply_to_message;

        try {
            // Reply message condition
            if (!reply_msg) {
                return await ctx.reply('Balas pesan ke user yang ingin didemote!');
            } else if (reply_msg?.from?.id === ctx.me.id) {
                return await ctx.reply('Umm... saya tidak bisa demote diri saya sendiri');
            }

            const from_user = await ctx.getChatMember(reply_msg!.from!.id);

            // Check if bot can promote target user
            if (from_user.status === 'creator') {
                return await ctx.reply('Saya tidak bisa demote pemilik grup!');
            } else if (from_user.status === 'administrator') {
                ctx.promoteChatMember(reply_msg!.from!.id);
            }

            await ctx.promoteChatMember(reply_msg!.from!.id);
            await ctx.reply(`${reply_msg?.from?.first_name} telah berubah status menjadi member`);
        } catch (err) {
            await ctx.reply('Ouch, terjadi error pada saat demote admin!\nError: ' + err);
        }
    })
);

export default composer;

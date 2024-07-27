import { Composer, GrammyError } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanPromoteUser, isAdmin } from '../helpers/adminHelper';
import { setErrorMessage } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer
    .chatType(['group', 'supergroup'])
    .command('demote')
    .filter(isAdmin)
    .use(botCanPromoteUser, async (ctx: MyContext) => {
        const reply_msg = ctx.message?.reply_to_message;

        try {
            // Reply message condition
            if (!reply_msg) {
                return await ctx.reply('Balas pesan ke user yang ingin didemote!');
            } else if (reply_msg?.from?.id === ctx.me.id) {
                return await ctx.reply('Umm... saya tidak bisa demote diri saya sendiri');
            }

            const member = await ctx.getChatMember(reply_msg!.from!.id);

            // Check if bot can promote target user
            if (member.status === 'creator') {
                return await ctx.reply('Saya tidak bisa demote pemilik grup!');
            }

            await ctx.promoteChatMember(member.user.id);
            await ctx.reply(`${member.user.first_name} telah berubah status menjadi member`);
        } catch (err: GrammyError | any) {
            const error_message = err.description.split(' ').at(-1);

            // Bot can't demote user when promoted by other admin
            if (error_message === 'CHAT_ADMIN_REQUIRED') {
                return await ctx.reply('Saya tidak bisa demote, kemungkinan pengguna dipromosikan oleh admin lain');
            }
            await ctx.reply(setErrorMessage(err));
        }
    });

export default composer;

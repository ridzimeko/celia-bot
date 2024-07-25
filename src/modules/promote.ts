import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanPromoteUser, isAdmin } from '../helpers/adminHelper';

const composer = new Composer<MyContext>();

composer
    .chatType(['group', 'supergroup'])
    .command(['tempadmin', 'promote'])
    .filter(isAdmin)
    .use(botCanPromoteUser, async (ctx: MyContext) => {
        const reply_msg = ctx.message?.reply_to_message;
        const command = ctx.message?.text?.split(' ')[0]; // Get command name

        const TEMP_ADMIN_PERMISSIONS = {
            can_manage_chat: true,
        };

        const ADMIN_PERMISSIONS = {
            can_manage_chat: true,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
        };

        try {
            // Reply message condition
            if (!reply_msg) {
                return await ctx.reply('Balas pesan ke user yang ingin di promote!');
            } else if (reply_msg?.from?.id === ctx.me.id) {
                return await ctx.reply('Umm... saya tidak bisa promote diri saya sendiri');
            }

            const from_user = await ctx.getChatMember(reply_msg!.from!.id);

            // Check if bot can promote target user
            if (from_user.status === 'creator') {
                return await ctx.reply('Untuk apa promote kalau dia adalah pemilik grup?');
            } else if (from_user.status === 'administrator') {
                await ctx.promoteChatMember(reply_msg!.from!.id);
            }

            if (command === '/tempadmin') {
                await ctx.promoteChatMember(reply_msg!.from!.id, TEMP_ADMIN_PERMISSIONS);
            } else {
                // command === '/promote'
                await ctx.promoteChatMember(reply_msg!.from!.id, ADMIN_PERMISSIONS);
            }

            await ctx.reply(`${reply_msg?.from?.first_name} berhasil dipromosikan sebagai admin!`);
        } catch (err) {
            await ctx.reply('Ouch, terjadi error pada saat mengangkat admin!\nError: ' + err);
        }
    });

export default composer;

import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { botCanPromoteUser, isAdmin } from '../helpers/adminHelper';

const composer = new Composer<MyContext>();

composer
    .chatType(['group', 'supergroup'])
    .command(['tempadmin', 'promote'])
    .filter(isAdmin)
    .use(botCanPromoteUser, async (ctx: MyContext) => {
        const user_id = ctx.message?.reply_to_message?.from?.id;
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
            if (!user_id) {
                return await ctx.reply('Balas pesan ke user yang ingin di promote!');
            } else if (user_id === ctx.me.id) {
                return await ctx.reply('Umm... saya tidak bisa promote diri saya sendiri');
            }

            const from_user = await ctx.getChatMember(user_id);

            // Check if bot can promote target user
            if (from_user.status === 'creator') {
                return await ctx.reply('Untuk apa promote kalau dia adalah pemilik grup?');
            } else if (from_user.status === 'administrator') {
                return await ctx.reply('Pengguna sudah menjadi admin');
            }

            if (command === '/tempadmin') {
                await ctx.promoteChatMember(from_user.user.id, TEMP_ADMIN_PERMISSIONS);
            } else {
                // command === '/promote'
                await ctx.promoteChatMember(from_user.user.id, ADMIN_PERMISSIONS);
            }

            await ctx.reply(`${from_user.user.first_name} berhasil dipromosikan sebagai admin!`);
        } catch (err: any) {
            await ctx.reply('Ouch, terjadi error pada saat mengangkat admin!\nError: ' + err.description);
        }
    });

export default composer;

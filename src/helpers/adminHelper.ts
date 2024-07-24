import { ChatMemberAdministrator } from 'grammy/types';
import { MyContext } from './bot.js';
import { setErrorMessage } from './utils.js';

const ADMIN_STATUS = ['creator', 'administrator'];

//  ==================== ADMIN STUFF ====================

async function checkAdmin(ctx: MyContext) {
    // Handle case where ctx.chat or ctx.from is undefined
    if (!ctx.chat || !ctx.from) {
        return false;
    }

    const member = await ctx.chatMembers.getChatMember(ctx.chat.id, ctx.from.id);

    if (ctx.config.isDeveloper || ctx.config.isSudo || ADMIN_STATUS.includes(member.status)) return true;
    ctx.reply('Hanya admin yang bisa menjalankan perintah ini!!');
    return false;
}

function botCanRestrictUser(handler: Function) {
    return async (ctx: MyContext) => {
        try {
            const me = await ctx.getChatMember(ctx.me.id); // Get bot status in the chat

            if (me.status === 'administrator') {
                if (me.can_restrict_members) return await handler(ctx);
                return await ctx.reply('Maaf, aku tidak punya izin untuk membatasi anggota');
            }
            return await ctx.reply('Aku bukan admin grup disini');
        } catch (err) {
            console.error(err);
        }
    };
}

function botCanPromoteUser(handler: Function) {
    return async (ctx: MyContext) => {
        const me = (await ctx.chatMembers.getChatMember(ctx.chat?.id, ctx.me.id)) as ChatMemberAdministrator;

        // Check current bot status
        if (me.status === 'administrator') {
            // Check if bot have permission to promote
            if (me.can_promote_members) {
                return await handler(ctx);
            }
            return await ctx.reply('Maaf, aku tidak punya izin untuk mempromosikan anggota');
        }

        return await ctx.reply('Aku bukan admin grup disini');
    };
}

// TODO
async function botCanDeleteMessage(ctx: MyContext) {
    const { status, can_delete_messages } = (await ctx.chatMembers.getChatMember(ctx.chat?.id, ctx.me.id)) as ChatMemberAdministrator;

    if (status === 'administrator') {
        if (can_delete_messages) return;
        else return await ctx.reply('Maaf, aku tidak punya izin untuk mempromosikan anggota');
    }

    await ctx.reply('Maaf, aku tidak punya izin untuk mempromosikan anggota');
}

export { checkAdmin, botCanRestrictUser, botCanPromoteUser };

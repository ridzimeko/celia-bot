import { ChatAdministratorRights, ChatMemberAdministrator } from 'grammy/types';
import { MyContext } from './bot.js';
import { NextFunction } from 'grammy';

const ADMIN_STATUS = ['creator', 'administrator'];

async function isAdmin(ctx: MyContext) {
    // Handle case where ctx.chat or ctx.from is undefined
    if (!ctx.chat || !ctx.from) return false;

    const member = await ctx.chatMembers.getChatMember(ctx.chat.id, ctx.from.id);

    if (ctx.from.id === ctx.config.botDeveloper || ADMIN_STATUS.includes(member.status)) return true;

    await ctx.reply('Hanya admin yang bisa menjalankan perintah ini!!');
    return false;
}

// Check if the bot has the specified permission
export function checkBotPermission(permission: keyof ChatAdministratorRights, errorMessage: string) {
    return async (ctx: MyContext, next: NextFunction) => {
        const me = await ctx.getChatMember(ctx.me.id);

        if (me.status === 'administrator') {
            if (me[permission]) return await next();
            return await ctx.reply(errorMessage);
        }

        ctx.reply('Saya bukan admin di grup ini!');
    };
}

// Restrict members middleware
const botCanRestrictUser = checkBotPermission('can_restrict_members', 'Maaf, aku tidak punya izin untuk membatasi anggota');

// Promote members middleware
const botCanPromoteUser = checkBotPermission('can_promote_members', 'Maaf, aku tidak punya izin untuk mempromosikan anggota');

// Pin chat message middleware
const botCanPinMessage = checkBotPermission('can_pin_messages', 'Maaf, aku tidak punya izin untuk menyematkan pesan');

export { botCanRestrictUser, botCanPromoteUser, botCanPinMessage, isAdmin };

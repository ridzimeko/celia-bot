import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import { setErrorMessage } from '../helpers/utils';

const composer = new Composer<MyContext>();

composer.on('my_chat_member', async (ctx) => {
    const { old_chat_member } = ctx.myChatMember;

    try {
        // send Message when bot added to group
        if (['kicked', 'left'].includes(old_chat_member.status)) {
            await ctx.reply(
                [
                    `Salam kenal namaku ${ctx.me.first_name}, terima kasih sudah menambahkanku di grup ${ctx.chat?.title}.`,
                    'Jika butuh bantuan ketik perintah /help dan jangan lupa jadikan saya admin',
                ].join(' ')
            );
        }
    } catch (err) {
        await ctx.api.sendMessage(ctx.config.logChatId, setErrorMessage(err));
    }
});

export default composer;

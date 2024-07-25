import { GrammyError } from 'grammy';

const checkDeveloper = async (ctx: any) => {
    if (ctx.config.isDeveloper) return true;

    if (ctx.update.message) {
        ctx.reply('Maaf, perintah ini hanya untuk masterku atau pengembang bot >_<');
    } else if (ctx.update.callback_query) {
        ctx.answerCallbackQuery({ text: 'Siapa kamu?! main tekan tekan tombol aja!', cache_time: 10000 });
    }
    return false;
};

async function sendErrorLogMessage(ctx: any, err: GrammyError) {
    // const text = () => {
    //     return "[ERROR_LOG] There's a error in bot!\nError: " + err.message
    // }
    return await ctx.api.sendMessage(ctx.config.logChatId, err.message);
}

function setErrorMessage(err: any | unknown) {
    return 'Ouch, terjadi error yang tidak diketahui\nError: ' + err.message;
}

export { checkDeveloper, sendErrorLogMessage, setErrorMessage };

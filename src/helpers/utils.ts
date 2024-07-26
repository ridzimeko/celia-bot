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

function setErrorMessage(error: string) {
    return 'Ouch, terjadi error yang tidak diketahui\nError: ' + error;
}

// format time like 2d (2 days), 10h (10 hour), 1y (1 year) to unix time

function toUnixTime(time: string) {
    const unit = time.at(-1);
    const value = time.slice(0, -1);
    switch (unit) {
        case 'd':
            return; // day
        case 'h':
            return parseInt(value) * 60 * 60; // hour
        case 'm':
            return parseInt(value) * 60; // month
        case 'y':
            return parseInt(value) * 365 * 24 * 60 * 60; // year
        default:
            return 0;
    }
}

function formatTimeUnix(time: number) {
    return new Date(time * 1000).toLocaleString();
}

export { checkDeveloper, sendErrorLogMessage, setErrorMessage, toUnixTime, formatTimeUnix };

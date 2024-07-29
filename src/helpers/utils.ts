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

function setErrorMessage(error: any) {
    const error_msg = error.description.split(' ').at(-1) || error;
    return 'Ouch, terjadi error yang tidak diketahui\nError: ' + error_msg;
}

// format time like 2d (2 days), 10h (10 hour), 1y (1 year) to unix time
function toUnixTime(time: string): number {
    if (!time) return 0;

    const unit = time.at(-1);
    const value = parseInt(time.slice(0, -1));

    if (isNaN(value)) return 0;

    const currentTime = Math.floor(Date.now() / 1000);

    switch (unit) {
        case 'd':
            return currentTime + value * 24 * 60 * 60; // day
        case 'h':
            return currentTime + value * 60 * 60; // hour
        case 'm':
            return currentTime + value * 60; // month
        case 'y':
            return currentTime + value * 365 * 24 * 60 * 60; // year
        default:
            return 0;
    }
}

function formatUnixTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}, ${hours}:${minutes} GMT`;

    return formattedDate;
}

export { checkDeveloper, sendErrorLogMessage, setErrorMessage, toUnixTime, formatUnixTime };

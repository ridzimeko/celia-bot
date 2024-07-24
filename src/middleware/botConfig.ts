import { NextFunction } from 'grammy';
import { MyContext } from '../helpers/bot';
import constants from '../config';

async function botConfig(ctx: MyContext, next: NextFunction) {
    ctx.config = {
        botSudo: constants.BOT_SUDO,
        botDeveloper: constants.BOT_DEVELOPER,
        isSudo: constants.BOT_SUDO.includes(ctx.from?.id),
        isDeveloper: ctx.from?.id === constants.BOT_DEVELOPER,
        logChatId: constants.BOT_CHATID_LOG,
    };

    await next();
}

export default botConfig;

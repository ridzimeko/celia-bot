import { NextFunction } from 'grammy';
import { MyContext } from '../helpers/bot';
import constants from '../config';

async function botConfig(ctx: MyContext, next: NextFunction) {
    ctx.config = {
        botDeveloper: constants.BOT_DEVELOPER,
        isDeveloper: ctx.from?.id === constants.BOT_DEVELOPER,
        logChatId: constants.BOT_CHATID_LOG,
    };

    await next();
}

export default botConfig;

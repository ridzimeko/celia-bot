import type { NextFunction } from 'grammy';
import constants from '../config';
import type { MyContext } from '../helpers/bot';

async function botConfig(ctx: MyContext, next: NextFunction) {
  ctx.config = {
    botDeveloper: constants.BOT_DEVELOPER,
    logChatId: constants.BOT_CHATID_LOG,
  };

  await next();
}

export default botConfig;

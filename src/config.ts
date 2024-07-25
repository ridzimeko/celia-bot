import 'dotenv/config';
import { cleanEnv, str, url, num, json } from 'envalid';

const constanst = cleanEnv(process.env, {
    MONGODB_URL: url(),
    BOT_TOKEN: str(),
    BOT_DEVELOPER: num(),
    BOT_CHATID_LOG: num(),
    DEEPL_API_KEY: str({ default: '' }),
});

export default constanst;

import { Composer, InlineQueryResultBuilder } from 'grammy';
import { setErrorMessage } from '../helpers/utils';
import { MyContext } from '../helpers/bot';
import axios, { AxiosError } from 'axios';
import constanst from '../config';

const composer = new Composer<MyContext>();

function translateMessage(ctx: MyContext, data: { text: (string | undefined)[]; target_lang: string }) {
    axios
        .post('https://api-free.deepl.com/v2/translate', data, {
            headers: {
                Authorization: `DeepL-Auth-Key ${constanst.DEEPL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            ctx.reply(
                `Source lang: <pre>${res.data.translations[0].detected_source_language}</pre>  \n\n${res.data.translations[0].text}`,
                { parse_mode: 'HTML' }
            );
        })
        .catch((error: AxiosError) => {
            ctx.reply(setErrorMessage(error.response ? error.response.data : error.message));
        });
}

composer.on(':text').hears(/^\/(translate|tl)(.*)/, async (ctx) => {
    if (!ctx.message?.reply_to_message) {
        return await ctx.reply('Balas pesan yang ingin kamu translate!');
    } else if (ctx.match[2] && ctx.match[2].length > 2) {
        return await ctx.reply('Target bahasa terjemahan tidak valid!');
    }

    const data = {
        text: [ctx.message?.reply_to_message?.text],
        target_lang: ctx.match[2] ? ctx.match[2].trim().toUpperCase() : 'EN',
    };

    translateMessage(ctx, data);
});

export default composer;

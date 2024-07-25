import { Composer } from 'grammy';
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
                `Source lang: ${res.data.translations[0].detected_source_language}  \n\n<pre>${res.data.translations[0].text}</pre>`,
                { parse_mode: 'HTML' }
            );
        })
        .catch((error: AxiosError) => {
            const { message } = error.response?.data as { message: string };
            if (error.response?.status === 400) {
                ctx.reply('Gagal translate, target bahasa tidak valid!');
            } else if (error.response?.status === 403) {
                ctx.reply(setErrorMessage('API key DeepL tidak valid!'));
            } else if (error.response?.status === 456) {
                ctx.reply(setErrorMessage('Quota API telah mencapai batas maksimal!'));
            } else if (error.response?.status === 429) {
                ctx.reply(setErrorMessage('Terlalu banyak request, silahkan coba lagi nanti!'));
            } else {
                ctx.reply(setErrorMessage(message || error.message));
            }
        });
}

composer.on(':text').hears(/^[\/](translate|tl)\b(.*)/, async (ctx) => {
    if (!ctx.message?.reply_to_message) {
        return await ctx.reply('Balas pesan yang ingin kamu translate!');
    }

    const data = {
        text: [ctx.message?.reply_to_message?.text],
        target_lang: ctx.match[2] ? ctx.match[2].trim().toUpperCase() : 'EN',
    };

    translateMessage(ctx, data);
});

export default composer;

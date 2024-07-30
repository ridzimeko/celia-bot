import { MyContext } from '../helpers/bot';
import { setErrorMessage } from '../helpers/utils';
import { Composer, InlineKeyboard } from 'grammy';

const composer = new Composer<MyContext>();
const privateChat = composer.chatType(['private']);

privateChat.command('start', async (ctx) => {
    try {
        await ctx.reply('Halo selamat datang!! ketik perintah /help untuk melihat perintah yang tersedia.');
    } catch (err) {
        await ctx.reply(setErrorMessage(err));
    }
});

privateChat.command('help', async (ctx) => {
    const message = [
        'Perintah yang tersedia :\n',
        '/about  -  melihat informasi tentang bot dan developer\n',
        '/react  -  memberi react ke pesan kamu\n',
        '/translate | /tl  -  menerjemahkan pesan ke bahasa lain\n',
        '/json - mengubah pesan ke json (dapat digunakan untuk debugging)\n',
        'Perintah untuk admin :\n',
        '/ban - blokir anggota grup\n',
        '/mute - bisukan anggota grup\n',
        '/pin - pin pesan di grup\n',
        '/unpin - melepas pin pesan grup\n',
        '/unpinall - melepas semua pin pesan\n',
        '/promote - mengangkat anggota sebagai admin\n',
        '/demote - melepas admin menjadi anggota\n',
    ];

    try {
        ctx.reply(message.join(''));
    } catch (err) {
        await ctx.reply(setErrorMessage(err));
    }
});

privateChat.command('about', async (ctx) => {
    try {
        const keyboard = new InlineKeyboard()
            .url('Developer', 'tg://user?id=' + ctx.config.botDeveloper)
            .url('Trakteer Kopi', 'https://trakteer.id/ridzimeko')
            .row();

        const text = [
            'Celia adalah waifu yang baik, pintar nggak peduli status ataupun jabatan seseorang\\.',
            'Bot ini hanya sekedar _project hobby_ dan dibuat menggunakan [Grammy](https://grammy.dev/)',
        ];

        await ctx.reply(text.join(' '), {
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard,
        });
    } catch (err) {
        await ctx.reply(setErrorMessage(err));
    }
});

composer.command('react', (ctx) => {
    ctx.react('🎉');
});

composer.command('ping', (ctx) => {
    ctx.reply('Pong!');
});

export default composer;

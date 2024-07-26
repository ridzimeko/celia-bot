import { MongoDBAdapter, ISession } from '@grammyjs/storage-mongodb';
import { ChatMember } from 'grammy/types';
import { chatMembers } from '@grammyjs/chat-members';
import mongoose from 'mongoose';
import bot from './helpers/bot';
import startMongo from './helpers/startMongo';
import modules from './modules';
import botConfig from './middleware/botConfig';
import checkRegisteredUser from './middleware/checkRegisteredUser';
import { GrammyError, HttpError } from 'grammy';

async function main() {
    console.log('Starting bot...');
    await startMongo();

    const collection = await mongoose.connection.db.collection<ISession>('chat_members');

    // Setup MongoDB adpater to store chat_member session
    const adapter = new MongoDBAdapter<ChatMember>({ collection });

    bot.use(
        chatMembers(adapter, {
            enableCaching: false,
        })
    );

    console.log('Importing all modules and middlewares...');

    bot.use(botConfig);
    bot.use(checkRegisteredUser);
    bot.use(modules);

    // Error handling
    bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error('Error in request:', err.message);
        } else if (e instanceof HttpError) {
            console.error('Could not contact Telegram:', err.message);
        } else {
            console.error('Unknown error:', err.message);
        }
    });

    // start bot
    bot.start({
        allowed_updates: [
            'my_chat_member',
            'chat_member',
            'message',
            'edited_message',
            'callback_query',
            'chat_join_request',
            'inline_query',
        ],
    });
    console.log('Bot started and running!');
}

main();

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

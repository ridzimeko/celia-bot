import { Composer, type FilterQuery } from 'grammy';
import type { MyContext } from '../helpers/bot';

const messageServicesTypes: FilterQuery[] = [
  ':video_chat_ended',
  ':video_chat_participants_invited',
  ':video_chat_scheduled',
  ':video_chat_started',
  ':forum_topic_closed',
  ':forum_topic_created',
  ':forum_topic_edited',
  ':forum_topic_reopened',
  ':new_chat_photo',
  ':new_chat_title',
  ':group_chat_created',
  ':delete_chat_photo',
  ':pinned_message',
  ':new_chat_members',
  ':left_chat_member',
  ':game',
];

const composer = new Composer<MyContext>();

// TODO : Delete Service Messages

// async function canDeleteServiceMessages(ctx: MyContext) {
//     const { status, can_delete_messages } = (await ctx.chatMembers.getChatMember(
//         ctx.chat?.id,
//         ctx.me.id
//     )) as ChatMemberAdministrator

//     if (status === 'administrator' && can_delete_messages) {
//         return true
//     }
//     return false
// }

// composer.chatType(['group', 'supergroup']).on(messageServicesTypes).filter(canDeleteServiceMessages, (ctx) => {

// })

// composer.chatType(['group', 'supergroup', 'private']).filter(checkAdmin, async (ctx) => {
//     if (ctx.chat.type === 'private') {
//         const inlineKeyboard = new InlineKeyboard();
//     }
// });

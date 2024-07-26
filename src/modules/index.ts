import { Composer } from 'grammy';
import { MyContext } from '../helpers/bot';
import chatMemberUpdate from './chatMemberUpdate';
import json from './json';
import leave from './leave';
import pinMessage from './pinMessage';
import promote from './promote';
import start from './start';
import translate from './translate';
import demote from './demote';
import banMember from './banMember';
import muteMember from './muteMember';
import unpinMessage from './unpinMessage';

const composer = new Composer<MyContext>();

composer.use(chatMemberUpdate, json, leave, pinMessage, promote, start, translate, demote, banMember, muteMember, unpinMessage);

export default composer;

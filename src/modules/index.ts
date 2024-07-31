import { Composer } from 'grammy';
import type { MyContext } from '../helpers/bot';
import banMember from './banMember';
import chatMemberUpdate from './chatMemberUpdate';
import demote from './demote';
import json from './json';
import leave from './leave';
import muteMember from './muteMember';
import pinMessage from './pinMessage';
import promote from './promote';
import start from './start';
import translate from './translate';
import unpinMessage from './unpinMessage';

const composer = new Composer<MyContext>();

composer.use(
  chatMemberUpdate,
  json,
  leave,
  pinMessage,
  promote,
  start,
  translate,
  demote,
  banMember,
  muteMember,
  unpinMessage,
);

export default composer;

import type { NextFunction } from 'grammy';
import type { User as UserTypes } from 'grammy/types';
import type { MyContext } from '../helpers/bot';
import User from '../models/users';

async function checkRegisteredUser(ctx: MyContext, next: NextFunction) {
  const { id, first_name, last_name, username } = ctx.from as UserTypes;
  const dbUser = await User.findOne({ userId: id });

  // skip middleware when chat type is not private
  if (ctx.chat?.type !== 'private') return await next();

  // create table when userId not found
  if (!dbUser) {
    await User.create({
      userId: id,
      firstName: first_name,
      lastName: last_name,
      username: username,
    });
  }

  // update user info when there's change with recent user info
  else if (
    dbUser.firstName !== first_name ||
    dbUser.lastName !== last_name ||
    dbUser.username !== username
  ) {
    await User.updateOne(
      { userId: id },
      {
        firstName: first_name,
        lastName: last_name,
        username: username,
      },
    );
  }

  await next();
}

export default checkRegisteredUser;

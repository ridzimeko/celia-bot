import { Composer, InlineKeyboard } from 'grammy';
import { isAdmin } from '../helpers/adminHelper';
import type { MyContext } from '../helpers/bot';
import { setErrorMessage } from '../helpers/utils';
import Group from '../models/groups';
import { MessageTypes } from '../types';

const composer = new Composer<MyContext>();

const group = composer.chatType(['group', 'supergroup']);

group.command('save').filter(isAdmin, async (ctx) => {
  try {
    const [arg1, arg2] = ctx.match.split(/\s+/);
    const { animation, text, audio, document, photo, video, sticker, voice } =
      ctx.msg.reply_to_message || {};
    const note_name = arg1?.toLowerCase();
    const textContent = text || arg2;
    let savedNote = false;

    // Check note name and value
    if (!note_name) return await ctx.reply('Berikan nama catatan yang ingin disimpan!');
    if (!/^[a-z0-9]+$/.test(note_name))
      return await ctx.reply('Catatan hanya menerima huruf dan angka!');
    if (!textContent && !ctx.msg.reply_to_message)
      return await ctx.reply('Anda harus memberikan isi pada catatan!');

    if (textContent) {
      savedNote = await Group.saveNotes(ctx.chat.id, note_name, MessageTypes.TEXT, textContent);
    } else if (animation) {
      savedNote = await Group.saveNotes(
        ctx.chat.id,
        note_name,
        MessageTypes.ANIMATION,
        animation.file_id,
      );
    } else if (audio) {
      savedNote = await Group.saveNotes(ctx.chat.id, note_name, MessageTypes.AUDIO, audio.file_id);
    } else if (document) {
      savedNote = await Group.saveNotes(
        ctx.chat.id,
        note_name,
        MessageTypes.DOCUMENT,
        document.file_id,
      );
    } else if (photo) {
      savedNote = await Group.saveNotes(
        ctx.chat.id,
        note_name,
        MessageTypes.PHOTO,
        photo[photo.length - 1].file_id,
      );
    } else if (video) {
      savedNote = await Group.saveNotes(ctx.chat.id, note_name, MessageTypes.VIDEO, video.file_id);
    } else if (sticker) {
      savedNote = await Group.saveNotes(
        ctx.chat.id,
        note_name,
        MessageTypes.STICKER,
        sticker.file_id,
      );
    } else if (voice) {
      savedNote = await Group.saveNotes(ctx.chat.id, note_name, MessageTypes.VOICE, voice.file_id);
    } else {
      return await ctx.reply('Media yang anda kirim tidak didukung untuk catatan');
    }

    if (savedNote)
      return await ctx.reply(`Catatan \`${note_name}\` berhasil disimpan`, {
        parse_mode: 'MarkdownV2',
      });
    await ctx.reply('Catatan gagal disimpan');
  } catch (error) {
    await ctx.reply(setErrorMessage(error));
  }
});

group.command('notes', async (ctx) => {
  try {
    const notes = await Group.getAllNotes(ctx.chat.id);
    if (!notes) return await ctx.reply('Tidak ada catatan yang tersimpan');

    const notes_msg = notes.map((note) => `• \`${note.name}\``).join('\n');

    await ctx.reply(
      notes_msg ? `Daftar catatan yang tersimpan:\n${notes_msg}` : 'Belum ada catatan tersimpan',
      { parse_mode: 'MarkdownV2' },
    );
  } catch (error: any) {
    await ctx.reply(setErrorMessage(error));
  }
});

group.hears(/\#(\S+)/).filter(isAdmin, async (ctx) => {
  try {
    const note_name = ctx.match[1].toLowerCase();
    const [note]: any = await Group.getNotes(ctx.chat.id, note_name);
    const message_id = ctx.msg.reply_to_message?.message_id || ctx.message.message_id;

    // skip if note not found
    if (!note) return;

    if (note.type === MessageTypes.TEXT) {
      await ctx.reply(note.value, {
        // parse_mode: 'MarkdownV2',  # TODO: Escape markdown characters
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.ANIMATION) {
      await ctx.replyWithAnimation(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.DOCUMENT) {
      await ctx.replyWithDocument(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.PHOTO) {
      await ctx.replyWithPhoto(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.VIDEO) {
      await ctx.replyWithVideo(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.AUDIO) {
      await ctx.replyWithAudio(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.STICKER) {
      await ctx.replyWithSticker(note.value, {
        reply_parameters: { message_id },
      });
    } else if (note.type === MessageTypes.VOICE) {
      await ctx.replyWithVoice(note.value, {
        reply_parameters: { message_id },
      });
    }
  } catch (error) {
    ctx.reply(setErrorMessage(error));
  }
});

group.command('clear').filter(isAdmin, async (ctx) => {
  try {
    const note_name = ctx.match.split(/\s+/)[0].toLowerCase();

    if (!note_name) return await ctx.reply('Berikan nama catatan yang ingin di hapus!');

    const deletedNote = await Group.deleteNotes(ctx.chat.id, note_name);

    if (deletedNote)
      await ctx.reply(`Catatan \`${note_name}\` berhasil di hapus`, { parse_mode: 'MarkdownV2' });
    else await ctx.reply('Catatan yang dihapus tidak ditemukan');
  } catch (error) {
    await ctx.reply(setErrorMessage(error));
  }
});

group.command('clearall').filter(isAdmin, async (ctx) => {
  const inline_keyboard = new InlineKeyboard()
    .text('Hapus semua catatan', 'confirm-clearall-notes')
    .text('Nggak jadi deh', 'cancel-clearall-notes');
  try {
    await ctx.reply(
      'Apakah kamu yakin ingin menghapus semua catatan? Semua catatan yang ada di grup ini akan di hapus',
      {
        reply_markup: inline_keyboard,
      },
    );
  } catch (error) {
    await ctx.reply(setErrorMessage(error));
  }
});

composer.callbackQuery('confirm-clearall-notes').filter(isAdmin, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('Catatan berhasil di hapus');
    await ctx.editMessageText('Semua catatan di hapus');
    await Group.clearAllNotes(ctx.callbackQuery.message?.chat.id || 0);
  } catch (error) {
    await ctx.answerCallbackQuery('Ups, terjadi error saat menghapus semua catatan');
  }
});

composer.callbackQuery('cancel-clearall-notes').filter(isAdmin, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('Hapus catatan dibatalkan');
    await ctx.editMessageText('Hapus catatan dibatalkan');
  } catch (error) {
    await ctx.answerCallbackQuery('Ups, terjadi error saat menghapus semua catatan');
  }
});

export default composer;

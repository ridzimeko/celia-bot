import { type Model, Schema, model } from 'mongoose';

interface INotes {
  name: string;
  type: string;
  value: string;
}

interface IGroup {
  chatId: number;
  chatName: string;
  configs: {
    cleanServices: string[];
    filters?: any;
    notes?: INotes[];
  };
}

interface GroupModel extends Model<IGroup> {
  findAdminById(userId: number): number;
  saveNotes(chatId: number, name: string, type: string, value: string): Promise<boolean>;
  getNotes(chatId: number, name: string): Promise<INotes>;
  getAllNotes(chatId: number): Promise<INotes[]>;
  deleteNotes(chatId: number, name: string): Promise<boolean>;
  clearAllNotes(chatId: number): Promise<boolean>;
}

const Groupschema = new Schema<IGroup, GroupModel>(
  {
    chatId: {
      type: Number,
      required: true,
    },
    chatName: {
      type: String,
      required: true,
    },
    configs: {
      cleanServices: { type: [String] },
      filters: { type: Schema.Types.Mixed },
      notes: [
        {
          name: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

Groupschema.static('findAdminById', function findAdminById(userId: number) {
  return this.findOne({ 'admins.user.id': userId });
});

Groupschema.static(
  'saveNotes',
  async function saveNotes(chatId: number, name: string, type: string, value: string) {
    try {
      const existingNotes = await this.findOne({ chatId, 'configs.notes.name': name });
      if (existingNotes) {
        await existingNotes.updateOne(
          { $set: { 'configs.notes.$[note].value': value, 'configs.notes.$[note].type': type } },
          { arrayFilters: [{ 'note.name': name }] },
        );
        return true;
      }

      await this.findOneAndUpdate(
        { chatId },
        { $push: { 'configs.notes': { name, type, value } } },
        { upsert: true },
      );
      return true;
    } catch (error) {
      console.error('Failed to save note: ', error);
      return false;
    }
  },
);

Groupschema.static('getNotes', function getNotes(chatId: number, name: string) {
  return this.aggregate([
    { $match: { chatId } },
    { $unwind: '$configs.notes' },
    { $match: { 'configs.notes.name': name } },
    { $replaceRoot: { newRoot: '$configs.notes' } },
  ]);
});

Groupschema.static('getAllNotes', function getAllNotes(chatId: number) {
  return this.aggregate([
    { $match: { chatId } },
    { $unwind: '$configs.notes' },
    { $replaceRoot: { newRoot: '$configs.notes' } },
  ]);
});

Groupschema.static('deleteNotes', function deleteNotes(chatId: number, name: string) {
  return this.findOne({ chatId, 'configs.notes.name': name })
    .then((group) => {
      if (group) {
        group.updateOne({ $pull: { 'configs.notes': { name } } }).exec();
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.error('Failed to delete notes: ', err.message);
    });
});

Groupschema.static('clearAllNotes', function clearAllNotes(chatId: number) {
  return this.findOneAndUpdate({ chatId }, { 'configs.notes': [] })
    .exec()
    .catch((err) => {
      console.error('Failed to clear all notes: ', err.message);
    });
});

const Group = model<IGroup, GroupModel>('Group', Groupschema);

export default Group;

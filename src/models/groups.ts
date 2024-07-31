import { type Model, Schema, model } from 'mongoose';

interface IGroup {
  chatId: number;
  chatName: string;
  admins?: any[];
  configs: {
    cleanServices: string[];
    filters?: any;
    notes?: string[];
  };
}

interface GroupModel extends Model<IGroup> {
  findAdminById(userId: number): number;
}

const Groupshema = new Schema<IGroup, GroupModel>(
  {
    chatId: {
      type: Number,
      required: true,
    },
    chatName: {
      type: String,
      required: true,
    },
    admins: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    configs: {
      type: {
        cleanServices: { type: [String] },
        filters: { type: Schema.Types.Mixed },
        notes: { type: Schema.Types.Mixed },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

Groupshema.static('findAdminById', function findAdminById(userId: number) {
  return this.findOne({ 'admins.user.id': userId });
});

// Groupshema.statics.setTemplate = function (chatId, template) {
//     if (template === null) {
//         return this.findOneAndUpdate({ chatId: chatId }, { $unset: { template: '' } })
//     }
//     return this.findOneAndUpdate({ chatId: chatId }, { template: template })
// }

const Group = model<IGroup, GroupModel>('Group', Groupshema);

export default Group;

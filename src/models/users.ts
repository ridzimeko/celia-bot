import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        firstName: String,
        lastName: String,
        username: String,
    },
    {
        virtuals: {
            fullname: {
                get() {
                    return this.firstName + ' ' + this.lastName;
                },
            },
        },
        collection: 'userInfo',
        timestamps: true,
    }
);

const User = model('User', userSchema);

export default User;

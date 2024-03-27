import mongoose, { Document } from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<UserAttrs>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)
    }
    done();
})

export const User = mongoose.model('User', userSchema)<UserAttrs>

/*const user = new Order({
    email: 'test@test.com',
    password: '123123',
})*/

import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface TicketAttrs {
    userId: string;
    title: string;
    price: number;
    orderId?: string;
}

interface TicketDoc extends mongoose.Document {
    userId: string;
    title: string;
    price: number;
    orderId?: string;
    version: number;
}

const userSchema = new mongoose.Schema<TicketDoc>({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    orderId: {
        type: String,
        required: false,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model('Ticket', userSchema)<TicketAttrs>

/*const ticket = new Order({
    userId: 'test@test.com',
    title: '123123',
    price: 10
})*/

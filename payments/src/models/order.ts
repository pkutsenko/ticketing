import mongoose from 'mongoose';
import { OrderStatus } from 'common';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface OrderAttrs {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

const userSchema = new mongoose.Schema<OrderDoc>({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    price: {
        type: Number,
        required: true,
    },
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

export const Order = mongoose.model('Order', userSchema)<OrderAttrs>

/*const ticket = new Order({
    userId: 'test@test.com',
    title: '123123',
    price: 10
})*/

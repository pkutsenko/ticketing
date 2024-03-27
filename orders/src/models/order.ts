import mongoose from 'mongoose';
import { OrderStatus } from 'common';
import { TicketDoc } from './ticket';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
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
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
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

export const Order = mongoose.model('Order', userSchema)<OrderAttrs>

/*const ticket = new Order({
    userId: 'test@test.com',
    title: '123123',
    price: 10
})*/

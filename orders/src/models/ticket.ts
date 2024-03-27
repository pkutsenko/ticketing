import mongoose from 'mongoose';
import {Order} from "./order";
import { OrderStatus } from 'common';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface TicketAttrs {
    _id?: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketMethods {
    isReserved(): Promise<boolean>;
}

type TicketModel = mongoose.Model<TicketAttrs, {}, TicketMethods>


const userSchema = new mongoose.Schema<TicketDoc>({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
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

userSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    return !!existingOrder;
}

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model('Ticket', userSchema)<TicketAttrs>

/*const ticket = new Ticket({
    title: '123123',
    price: 10
})

ticket.isReserved();*/

import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface PaymentAttrs {
    orderId: string;
    stripeId: string;
    userId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
    userId: string;
}

const userSchema = new mongoose.Schema<PaymentDoc>({
    orderId: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
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

// userSchema.set('versionKey', 'version');
// userSchema.plugin(updateIfCurrentPlugin);

export const Payment = mongoose.model('Payment', userSchema)<PaymentAttrs>

/*const ticket = new Order({
    userId: 'test@test.com',
    title: '123123',
    price: 10
})*/

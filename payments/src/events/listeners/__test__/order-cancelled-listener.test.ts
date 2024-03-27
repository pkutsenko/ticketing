import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";
import {Order} from "../../../models/order";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = new Order({
        version: 0,
        status: OrderStatus.Created,
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(), // not real one
        id: new mongoose.Types.ObjectId().toHexString(), // not real one
    })

    await order.save();

    const msg = {
        ack: jest.fn()
    } as unknown as Message;

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 190,
        }
    };

    return {listener, data, msg }
}

describe('order created listener', () => {
    it('cancels the payment', async () => {
        const {listener, data, msg} = await setup();
        await listener.onMessage(data, msg);

        const order = await Order.findById(data.id);

        expect(order!.status).toEqual(OrderStatus.Cancelled);

        expect(msg.ack).toHaveBeenCalled();
    });
})

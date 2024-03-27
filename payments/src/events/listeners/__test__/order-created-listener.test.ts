import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Order} from "../../../models/order";


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const msg = {
        ack: jest.fn()
    } as unknown as Message;

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10,
        }
    };

    return {listener, data, msg }
}

describe('order created listener', () => {
    it('creates an order', async () => {
        const {listener, data, msg} = await setup();
        await listener.onMessage(data, msg);

        const order = await Order.findById(data.id);

        expect(order!.id).toEqual(data.id);

        expect(msg.ack).toHaveBeenCalled();
    });
})

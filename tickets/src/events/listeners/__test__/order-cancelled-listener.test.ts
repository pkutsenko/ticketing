import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = new Ticket({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(), // not real one
        orderId: new mongoose.Types.ObjectId().toHexString(), // not real one
    })

    await ticket.save();

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
            id: ticket.id,
            price: ticket.price,
        }
    };

    return {listener, ticket, data, msg }
}

describe('order created listener', () => {
    it('sets the userId of the ticket', async () => {
        const {listener, ticket, data, msg} = await setup();
        await listener.onMessage(data, msg);

        const ticket1 = await Ticket.findById(data.ticket.id);

        expect(ticket1!.orderId).toBeUndefined();

        expect(msg.ack).toHaveBeenCalled();
    });

    it('updates the ticket', async () => {

        const {listener, ticket, data, msg} = await setup();
        await listener.onMessage(data, msg);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
})

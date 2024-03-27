import {Message} from "node-nats-streaming";
import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent} from "common";
import mongoose from "mongoose";
import {Ticket} from "../../../models/ticket";
import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {Order} from "../../../models/order";

describe('ticket created listener', () => {
    const setup = async () => {
        const listener = new ExpirationCompleteListener(natsWrapper.client);

        const ticket = new Ticket({
            title: 'concert',
            price: 10
        })

        await ticket.save();

        const order = new Order({
            status: OrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date(),
            ticket
        })

        await order.save();

        const data: ExpirationCompleteEvent['data'] = {
            orderId: order.id
        };

        const msg = {
            ack: jest.fn()
        } as unknown as Message;

        return {listener, data, msg, ticket, order}
    }

    it('updates the order status', async () => {
        const {  listener, data, msg, ticket, order} = await setup();
        await listener.onMessage(data, msg);
        const updatedOrder = await Order.findById(order.id);

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
        expect(msg.ack).toHaveBeenCalled();
    })
})

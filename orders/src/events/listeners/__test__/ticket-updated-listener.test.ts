import {Message} from "node-nats-streaming";
import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent, TicketUpdatedEvent} from "common";
import mongoose from "mongoose";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

describe('ticket updated listener', () => {
    const setup = async () => {
        const listener = new TicketUpdatedListener(natsWrapper.client);
        const data: TicketUpdatedEvent['data'] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'concert',
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
            version: 1
        };

        const msg = {
            ack: jest.fn()
        } as unknown as Message;

        return {listener, data, msg}
    }

    it('updates and saves a ticket', async () => {
        const {  listener, data, msg} = await setup();

        const ticket = new Ticket({
            title: data.title,
            price: data.price
        });

        await ticket.save();

        await listener.onMessage({
            ...data,
            id: ticket.id,
            version: ticket.version + 1
        }, msg);

        const ticket1 = await Ticket.findById(ticket.id);

        expect(ticket1).toBeDefined();
        expect(ticket1!.title).toEqual(data.title);
        expect(ticket1!.price).toEqual(data.price);
        expect(ticket1!.version).toEqual(ticket.version + 1);
        expect(msg.ack).toHaveBeenCalled();
    })

    it('does not call ack if the event has a skipped version number', async () => {
        const {  listener, data, msg} = await setup();

        const ticket = new Ticket({
            title: data.title,
            price: data.price
        });

        await ticket.save();

        try {
            await listener.onMessage({
                ...data,
                id: ticket.id,
                version: ticket.version + 10
            }, msg);
        } catch (err) {
            console.log(err);
        }
        expect(msg.ack).not.toHaveBeenCalled();

    })
})

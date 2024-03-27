import {Message} from "node-nats-streaming";
import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import { TicketCreatedEvent } from "common";
import mongoose from "mongoose";
import {Ticket} from "../../../models/ticket";

describe('ticket created listener', () => {
    const setup = async () => {
        const listener = new TicketCreatedListener(natsWrapper.client);
        const data: TicketCreatedEvent['data'] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'concert',
            price: 10,
            userId: new mongoose.Types.ObjectId().toHexString(),
            version: 0
        };

        const msg = {
            ack: jest.fn()
        } as unknown as Message;

        return {listener, data, msg}
    }

    it('creates and saves a ticket', async () => {
        const {  listener, data, msg} = await setup();
        await listener.onMessage(data, msg);
        const ticket = await Ticket.findById(data.id);

        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title);
        expect(ticket!.price).toEqual(data.price);
        expect(ticket!.version).toEqual(data.version);
        expect(msg.ack).toHaveBeenCalled();
    })
})

import {Listener, Subjects, TicketCreatedEvent, TicketUpdatedEvent} from "common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        const {id, title, price, userId, version} = data;
        const ticket = await Ticket.findOne({
            _id: id,
            version: version - 1,
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({title, price, userId});
        await ticket.save();
        msg.ack();
    }
}

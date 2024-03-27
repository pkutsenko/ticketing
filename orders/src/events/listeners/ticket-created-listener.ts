import {Listener, Subjects, TicketCreatedEvent} from "common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        const {id, title, price, userId} = data;
        const ticket = new Ticket({
            _id: id,
            title,
            price,
        })
        await ticket.save();
        msg.ack();
    }
}

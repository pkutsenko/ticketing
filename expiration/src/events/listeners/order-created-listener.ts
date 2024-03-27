import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from 'common';
import { queueGroupName } from './queue-group-name';
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        await expirationQueue.add({
            orderId: data.id,
        }, {
            delay: new Date(data.expiresAt).getTime() - new Date().getTime()
        })

        msg.ack();
    }
}

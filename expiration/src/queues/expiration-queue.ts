import Queue from 'bull';
import {natsWrapper} from '../nats-wrapper';
import {ExpirationCompletePublisher} from '../events/publishers/expiration-complete-publisher';

interface Payload {
    orderId: string;
}

export class ExpirationQueue extends Queue<Payload> {
    constructor() {
        super('order:expiration', {
            redis: {
                host: process.env.REDIS_HOST
            }
        });

        this.process(async job => {
            new ExpirationCompletePublisher(natsWrapper.client).publish({
                orderId: job.data.orderId
            })
        })
}
}

export const expirationQueue = new ExpirationQueue();

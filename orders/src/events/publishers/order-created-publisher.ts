import {BasePublisher, Subjects} from "common";
import { OrderCreatedEvent } from "common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}

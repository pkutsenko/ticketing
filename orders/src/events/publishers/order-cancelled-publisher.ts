import {BasePublisher, Subjects, OrderCancelledEvent} from "common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}

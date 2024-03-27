import {BasePublisher, Subjects, TicketUpdatedEvent} from "common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}

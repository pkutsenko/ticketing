import {BasePublisher, Subjects} from "common";
import { TicketCreatedEvent } from "common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}

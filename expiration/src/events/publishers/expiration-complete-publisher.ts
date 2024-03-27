import {ExpirationCompleteEvent, Subjects, BasePublisher} from "common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}

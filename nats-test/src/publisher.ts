import nats from 'node-nats-streaming';
import {TicketCreatedEvent} from "./events/ticket-created-event";
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
  //waitOnFirstConnect: true,
});

stan.on('connect', () => {
  console.log('BasePublisher connected to NATS');

  (new TicketCreatedPublisher(stan)).publish({
    id: '123',
    title: 'concert',
    price: 20,
  })
});

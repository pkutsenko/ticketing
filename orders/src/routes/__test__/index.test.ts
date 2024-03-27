import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

describe('index', () => {
    const buildTicket = async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();
        return ticket;
    }
    it('fetches orders for an particular user', async () => {
        const ticketOne = await buildTicket();
        const ticketTwo = await buildTicket();
        const ticketThree = await buildTicket();

        const userOne = signup();
        const userTwo = signup();

        await request(app)
            .post('/api/orders')
            .set('Cookie', userOne)
            .send({
                ticketId: ticketOne.id,
            })
            .expect(201)
        await request(app)
            .post('/api/orders')
            .set('Cookie', userTwo)
            .send({
                ticketId: ticketTwo.id,
            })
            .expect(201)
        await request(app)
            .post('/api/orders')
            .set('Cookie', userTwo)
            .send({
                ticketId: ticketThree.id,
            })
            .expect(201)

        const response = await request(app)
            .get(`/api/orders/`)
            .set('Cookie', userTwo)
            .send()
            .expect(200)

        expect(response.body.length).toEqual(2)
    })
})

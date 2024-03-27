import request from 'supertest';
import { app } from '../../app'
import {Ticket} from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";

describe('/api/tickets post', () => {
    it('has a route handler listening to /api/tickets for post request', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({})

        expect(response.status).not.toEqual(404);
    })

    it('can only be accessed if user is signed in', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401)
    })

    it('returns not 401 if the user is signed in', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({})

        expect(response.status).not.toEqual(401)
    })

    it('returns an error if an invalid title is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: '',
                price: 10,
            })
            .expect(400)
    })

    it('returns an error if an invalid price is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: '123',
                price: -10,
            })
            .expect(400)
    })

    it('creates a ticket with valid inputs', async () => {
        let tickets = await Ticket.find({});

        expect(tickets.length).toEqual(0)

        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: 'test',
                price: 10,
            })
            .expect(201)

        tickets = await Ticket.find({});

        expect(tickets.length).toEqual(1)
        expect(tickets[0].price).toEqual(10)
    })

    it('publishes an event', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: 'test',
                price: 10,
            })
            .expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    })
})


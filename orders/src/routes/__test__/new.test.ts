import request from 'supertest';
import { app } from '../../app'
import {Order} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";
import { OrderStatus } from 'common';

describe('/api/orders post', () => {
    it('returns a 404 if the ticket does not exist', async () => {
        const ticketId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post('/api/orders')
            .set('Cookie', signup())
            .send({ticketId})

        expect(response.status).toEqual(404);
    })

    it('returns an error if the ticket is already reserved', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();

        const order = new Order({
            ticket,
            userId: 'asdf',
            status: OrderStatus.Created,
            expiresAt: new Date()
        })

        await order.save();

        const response = await request(app)
            .post('/api/orders')
            .set('Cookie', signup())
            .send({ticketId: ticket.id})
            .expect(400)
    })

    it('reserves a ticket', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();

        const response = await request(app)
            .post('/api/orders')
            .set('Cookie', signup())
            .send({ticketId: ticket.id})
            .expect(201)
    })

    it('emits an order created event', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', signup())
            .send({ticketId: ticket.id})
            .expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    })
})


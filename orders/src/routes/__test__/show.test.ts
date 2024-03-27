import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";

describe('show', () => {
    it('fetches the order', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();

        const user = signup();

        const {body: order} = await request(app)
            .post(`/api/orders`)
            .set('Cookie', user)
            .send({ticketId: ticket.id})
            .expect(201)

        const {body: fetchedOrder} = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(200)

        expect(order.id).toEqual(fetchedOrder.id)
    })

    it('returns an error if one user tries to fetch another users order', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 20
        });
        await ticket.save();

        const user = signup();

        const {body: order} = await request(app)
            .post(`/api/orders`)
            .set('Cookie', user)
            .send({ticketId: ticket.id})
            .expect(201)

        const {body: fetchedOrder} = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', signup())
            .send()
            .expect(401)
    })
})

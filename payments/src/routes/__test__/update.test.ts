import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";

describe('update', () => {
    it('returns 404 if the provided id does not exist', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', signup())
            .send({
                title: 'test1',
                price: 10,
            })
            .expect(404)
    })

    it('returns 401 if the user is not authenticated', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'test1',
                price: 10,
            })
            .expect(401)
    })

    it('returns 401 if the user does not own the ticket', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app)
            .post(`/api/tickets`)
            .set('Cookie', signup())
            .send({
                title: 'test1',
                price: 10,
            })
        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', signup())
            .send({
                title: 'test2',
                price: 20,
            })
            .expect(401)
    })

    it('returns 400 if the user provides an invalid title or price', async () => {
        const cookie = signup()
        const response = await request(app)
            .post(`/api/tickets`)
            .set('Cookie', cookie)
            .send({
                title: 'test1',
                price: 10,
            })
        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: '',
                price: 20,
            })
            .expect(400)

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'test2',
                price: -20,
            })
            .expect(400)
    })

    it('updates the ticket provided valid inputs', async () => {
        const cookie = signup()
        const response = await request(app)
            .post(`/api/tickets`)
            .set('Cookie', cookie)
            .send({
                title: 'test1',
                price: 10,
            })

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'test2',
                price: 20,
            })
            .expect(200)

        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send()
            .expect(200)

        expect(ticketResponse.body.title).toEqual('test2');
        expect(ticketResponse.body.price).toEqual(20);
    })

    it('rejects updates if the ticket is reserved', async () => {
        const cookie = signup()
        const response = await request(app)
            .post(`/api/tickets`)
            .set('Cookie', cookie)
            .send({
                title: 'test1',
                price: 10,
            })

        const ticket = await Ticket.findById(response.body.id)
        ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()})
        await ticket!.save()

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'test2',
                price: 20,
            })
            .expect(400)
    })
})

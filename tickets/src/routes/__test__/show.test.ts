import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

describe('show', () => {
    it('returns a 404 if the ticket is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .get(`/api/tickets/${id}`)
            .set('Cookie', signup())
            .send()
            .expect(404)
    })

    it('returns the ticket if the ticket is found', async () => {
        const title = 'party';
        const price = 20;

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title,
                price,
            })
            .expect(201)

        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .set('Cookie', signup())
            .send()
            .expect(200)

        expect(ticketResponse.body.title).toEqual(title)
        expect(ticketResponse.body.price).toEqual(price)
    })
})

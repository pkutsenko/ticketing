import request from "supertest";
import {app} from "../../app";

describe('index', () => {
    it('can fetch a list of tickets', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: 'test1',
                price: 10,
            })
            .expect(201)
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: 'test2',
                price: 20,
            })
            .expect(201)
        await request(app)
            .post('/api/tickets')
            .set('Cookie', signup())
            .send({
                title: 'test3',
                price: 30,
            })
            .expect(201)

        const response = await request(app)
            .get(`/api/tickets/`)
            .set('Cookie', signup())
            .send()
            .expect(200)

        expect(response.body.length).toEqual(3)
    })
})

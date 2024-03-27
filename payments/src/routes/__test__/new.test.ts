import request from 'supertest';
import { app } from '../../app'
import {Ticket} from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import { OrderStatus } from 'common';

describe('/api/payments post', () => {
    it('returns a 404 if the order does not exist', async () => {
        const response = await request(app)
            .post('/api/payments')
            .set('Cookie', signup())
            .send({token: '123', orderId: new mongoose.Types.ObjectId().toHexString()})

        expect(response.status).toEqual(404);
    })

    it('returns a 401 if the user is not signed in', async () => {
        const order = new Order({
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            userId: new mongoose.Types.ObjectId().toHexString(),
            price: 10,
            status: OrderStatus.Created
        })

        await order.save()

        const response = await request(app)
            .post('/api/payments')
            .send({token: '123', orderId: order.id})
            .set('Cookie', signup())
            .expect(401)
    })

    it('returns a 400 when purchasing an order that has been cancelled', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const user = signup(userId);
        const order = new Order({
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            userId: userId,
            price: 10,
            status: OrderStatus.Cancelled
        })

        await order.save()

        const response = await request(app)
            .post('/api/payments')
            .send({token: '123', orderId: order.id})
            .set('Cookie', user)
            .expect(400)
    })

    it('succesfully creates a payment', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const user = signup(userId);
        const order = new Order({
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            userId: userId,
            price: 10,
            status: OrderStatus.Created
        })

        await order.save()

        const response = await request(app)
            .post('/api/payments')
            .send({token: 'tok_visa', orderId: order.id})
            .set('Cookie', user)
            .expect(201)
    })
})


import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";
import { OrderStatus } from "common";
import {Order} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";

describe('update', () => {
    it('marks an order as cancelled', async () => {
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
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204)

        console.log(fetchedOrder)

        const updatedOrder = await Order.findById(order.id);


        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    })

    it('publishes an order cancelled event', async () => {
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

        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204)

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    })
})

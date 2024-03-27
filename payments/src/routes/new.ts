import express, {Request, Response} from "express";
import { body } from 'express-validator'
import {BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest} from 'common'
import {Ticket} from "../models/ticket";
import {TicketCreatedPublisher} from "../events/publishers/ticket-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty()
        .withMessage('Token is required'),
    body('orderId')
        .not()
        .isEmpty()
        .withMessage('orderId is required'),
], validateRequest, async (req: Request, res: Response) => {
    const orderId = req.body.orderId;
    const token = req.body.token;
    const order = await Order.findById(orderId);

    if(!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = new Payment({
        orderId,
        stripeId: charge.id as string,
        userId: req.currentUser!.id
    })

    await payment.save();

    res.status(201).send({success: true})
})

export { router as createTicketRouter }

import express, {Request, Response} from "express";
import { body } from 'express-validator'
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from 'common'
import {Order} from "../models/order";

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order)
})

export { router as showOrdersRouter }

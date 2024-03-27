import express from 'express';
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from 'cookie-session'
import {currentUser, errorHandler, NotFoundError, requireAuth} from 'common';
import {createOrdersRouter} from "./routes/new";
import {showOrdersRouter} from "./routes/show";
import {indexOrderRouter} from "./routes";
import {deleteOrderRouter} from "./routes/delete";

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))

app.use(currentUser)
// app.use(requireAuth)
app.use(createOrdersRouter)
app.use(showOrdersRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler)

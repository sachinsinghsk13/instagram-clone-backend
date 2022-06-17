import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { indexRouter } from './routes/index.route';
import { createModuleLogger } from "./utils/logger";
import path from 'path';
import { connect, connection } from 'mongoose';
import { GlobalExceptionHandler } from './exceptions/global-exception-handler.middleware';
import { InstagramCloneException } from './exceptions/instagram-clone.exception';
import { StatusCodes } from 'http-status-codes';
// -----------------------
dotenv.config();
const logger = createModuleLogger('InstagramCloneApp');


connection.on('connecting', () => logger.info('Connecting to Database...'));
connection.on('connected', () => logger.info('Connected to Database Successfully'));
connection.on('error', () => logger.error('An error occured in database'));
connect(`mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE}`);

const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded());
app.use('/api', indexRouter);
app.get('/test',(req:Request, res: Response, next: NextFunction) => {
    try {
        throw new InstagramCloneException("Email not allowed", StatusCodes.NOT_FOUND, "303")    ;
        res.json({message: 'Okay'});
    } catch (error) {
        next(error);
    }
   
});
app.use(GlobalExceptionHandler);
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => {
    logger.info(`Node server started listening on port ${port}`);
});
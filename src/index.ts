import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { indexRouter } from './routes/index.route';
import { createModuleLogger } from "./utils/logger";
import path from 'path';
import { connect, connection, ConnectOptions } from 'mongoose';
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
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => {
    logger.info(`Node server started listening on port ${port}`);
});
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { indexRouter } from './routes/index.route';
import { createModuleLogger } from "./utils/logger";
// -----------------------
dotenv.config();
const logger = createModuleLogger('InstagramCloneApp');
const app = express();



app.use('/api', indexRouter);
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => {
    logger.info(`Node server started listening on port ${port}`);
});
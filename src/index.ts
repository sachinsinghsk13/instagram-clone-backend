import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createModuleLogger } from "./utils/logger";
// -----------------------
dotenv.config();
const logger = createModuleLogger('InstagramCloneApp');
const app = express();
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'working' });
});
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => {
    logger.info(`Node server started listening on port ${port}`);
});
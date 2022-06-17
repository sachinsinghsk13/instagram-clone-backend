import { createTransport, SentMessageInfo } from 'nodemailer';
import { createModuleLogger } from '../utils/logger';
import { renderFile } from "ejs";
import path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const logger = createModuleLogger('EmailService');

logger.debug(`Email: ${process.env.EMAIL_USER}`);
logger.debug(`Password: ${process.env.EMAIL_PASSWORD}`);
const transport = createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function testTransporter() {
    await transport.verify();
}

export class EmailService {
    static async sendTestMail() {
        try {
            const data = await renderFile(path.join(__dirname, '../templates/est.html'), { name: 'Sachin' });
            var mainOptions = {
                from: 'sachinsingh.sk13@gmail.com',
                to: 'sachinsinghsk369@gmail.com',
                subject: 'Account Activated',
                html: data
            };
            let messageInfo: SMTPTransport.SentMessageInfo = await transport.sendMail(mainOptions);
            messageInfo.accepted.forEach((address: any) => logger.info(`Email Successfully Sent To : ${address}`));
        } catch (error: any) {
            logger.error(error.stack)
        }
    }
}

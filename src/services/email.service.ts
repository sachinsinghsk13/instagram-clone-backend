import { createTransport, SentMessageInfo } from 'nodemailer';
import { createModuleLogger } from '../utils/logger';
import { renderFile } from "ejs";
import path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from '../models/user.model';
import Mail from 'nodemailer/lib/mailer';
import { IUserRegistrationToken } from '../models/user-registration-token.model';
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
            var mailOptions = {
                from: process.env.SENT_FROM,
                to: 'sachinsinghsk369@gmail.com',
                subject: 'Account Activated',
                html: data
            };
            let messageInfo: SMTPTransport.SentMessageInfo = await transport.sendMail(mailOptions);
            messageInfo.accepted.forEach((address: any) => logger.info(`Email Successfully Sent To : ${address}`));
        } catch (error: any) {
            logger.error(error.stack)
        }
    }

    static async sendRegistrationVerifyEmail(user: User, token: IUserRegistrationToken) {
        try {
            const data = await renderFile(path.join(__dirname, '../templates/verify-registration.html'), { user, token });
            
            var mailOptions: Mail.Options = {
                from: process.env.SENT_FROM,
                to: user.email,
                subject: `Instagram Clone Email Verification`,
                html: data
            };
            let messageInfo: SMTPTransport.SentMessageInfo = await transport.sendMail(mailOptions);
            messageInfo.accepted.forEach((address: any) => logger.info(`Email Successfully Sent To : ${address}`));
        } catch (error: any) {
            logger.error(error.stack)
        }
    }
}

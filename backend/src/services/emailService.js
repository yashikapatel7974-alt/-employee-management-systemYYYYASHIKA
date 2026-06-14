const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(options) {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME || 'Enterprise EMS'} <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html // Optional HTML support
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Message sent: ${info.messageId}`);
        } catch (error) {
            logger.error(`Error sending email: ${error.message}`);
        }
    }
}

module.exports = new EmailService();

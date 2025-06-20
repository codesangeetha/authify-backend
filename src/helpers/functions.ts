import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";


dotenv.config();

const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;
const TOKEN = process.env.MAILTRAP_TOKEN!;

const client = new MailtrapClient({ token: TOKEN });

export const sendEmail = async (
    toEmail: string,
    subject: string,
    message: string
): Promise<void> => {
    const sender = {
        email: "mailtrap@demomailtrap.com",
        name: "Mailtrap Test",
    };

    const recipients = [
        {
            email: toEmail,
        },
    ];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: subject,
            text: message,
            category: "Integration Test",
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

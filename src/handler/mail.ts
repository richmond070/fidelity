import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "mail.eternaltrading.org",
    port: 465,
    secure: false, // Replace with your SMTP service provider
    auth: {
        user: 'eternaltradingsupport@eternaltrading.org',
        pass: 'EternalTrading031' // Replace with your email password (or use environment variables)
    },
    tls: {
        rejectUnauthorized: true
    }
});


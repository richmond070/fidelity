
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true, // Replace with your SMTP service provider
    auth: {
        user: 'support@eternaltrading.org',
        pass: 'EternalTrading031' // Replace with your email password (or use environment variables)
    },
    tls: {
        rejectUnauthorized: false
    }
});


transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready")
    }
})
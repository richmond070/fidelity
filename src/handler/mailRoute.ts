import express from "express";
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { transporter } from "./mail";

export const mailRoute = express.Router()



// Define a route to send emails
mailRoute.post("/send", (req, res) => {
    const { to, subject, text } = req.body;

    // Create email data
    const mailOptions = {
        from: "eternaltradingsupport@eternaltrading.org", // Replace with your email
        to,
        subject,
        text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: " + error);
            res.status(500).json({ error: "An error occurred while sending the email." });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Email sent successfully!" });
        }
    });
});


// import express from 'express';
// import emailService from './mail'

// const emailrouter = express.Router();

// emailrouter.post('/send-email', async (req, res) => {
//     const { to, subject, text } = req.body;

//     try {
//         await emailService.sendMail(to, subject, text);
//         res.status(200).send('Email sent successfully!');
//     } catch (error: any) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// export default emailrouter;

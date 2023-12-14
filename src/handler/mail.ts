
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "mail.eternaltrading.org",
    port: 465,
    secure: true, // Replace with your SMTP service provider
    auth: {
        user: 'support@eternaltrading.org',
        pass: 'EternalTrading031' // Replace with your email password (or use environment variables)
    },
    tls: {
        rejectUnauthorized: true
    }
});


const html = `
    <h1>Hello World</h1>
    <p>Isn't Nodemailer useful</p>
`;

// // async function main() {
// const transporter = nodemailer.createTransport({
//     host: 'mail.eternaltrading.org',
//     port: 587,
//     secure: false,
//     auth: {
//         // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//         user: "support@eternaltrading.org",
//         pass: "EternalTrading031",
//     },
// });

// const info = transporter.sendMail({
//     from: 'EternalTrading <support@eternaltrading.org>',
//     to: 'ekezierichmond90@gmail.com',
//     subject: 'Testing Testing',
//     html: html,
// })

// // console.log("Message sent" + info.messageId);
// // }


// // verify connection configuration
// transporter.verify(function (error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Server is ready to take our messages");
//     }
// });

// main();



// import nodemailer from 'nodemailer';

// class EmailService {
//     private transporter: nodemailer.Transporter;

//     constructor() {
//         this.transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'ekezierichmond90@gmail.com',
//                 pass: 'richard031',
//             },
//         });
//     }

//     sendMail(to: string, subject: string, text: string) {
//         const mailOptions: nodemailer.SendMailOptions = {
//             from: 'ekezierichmond90@gmail.com',
//             to,
//             subject,
//             text,
//         };

//         return this.transporter.sendMail(mailOptions);
//     }
// }

// export default new EmailService();

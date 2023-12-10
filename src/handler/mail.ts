import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//     host: "mail.eternaltrading.org",
//     port: 465,
//     secure: false, // Replace with your SMTP service provider
//     auth: {
//         user: 'eternaltradingsupport@eternaltrading.org',
//         pass: 'EternalTrading031' // Replace with your email password (or use environment variables)
//     },
//     tls: {
//         rejectUnauthorized: true
//     }
// });


const html = `
    <h1>Hello World</h1>
    <p>Isn't Nodemailer useful</p>
`;

// async function main() {
//     nodemailer.createTransport({
//     });
// }

// main();
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "mail.eternaltrading.org",
    port: 465,
    secure: true,
    auth: {
        user: 'support@eternaltrading.org',
        pass: 'EternalTrading031'
    },
    tls: {
        rejectUnauthorized: true
    }
});
const html = `
    <h1>Hello World</h1>
    <p>Isn't Nodemailer useful</p>
`;
//# sourceMappingURL=mail.js.map
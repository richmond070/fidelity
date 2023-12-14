"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailRoute = void 0;
const express_1 = __importDefault(require("express"));
const mail_1 = require("./mail");
exports.mailRoute = express_1.default.Router();
exports.mailRoute.post("/send", (req, res) => {
    const { to, subject, text } = req.body;
    const mailOptions = {
        from: "eternaltradingsupport@eternaltrading.org",
        to,
        subject,
        text,
    };
    mail_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: " + error);
            res.status(500).json({ error: "An error occurred while sending the email." });
        }
        else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Email sent successfully!" });
        }
    });
});
//# sourceMappingURL=mailRoute.js.map
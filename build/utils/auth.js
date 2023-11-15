"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authentication {
    static generateToken(id, userName) {
        const secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
        const payload = { userId: id, userName: userName };
        const option = { expiresIn: process.env.JWT_EXPIRES_IN };
        return jsonwebtoken_1.default.sign(payload, secretKey, option);
    }
    static validationToken(token) {
        try {
            const secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
            return jsonwebtoken_1.default.verify(token, secretKey);
        }
        catch (error) {
            return null;
        }
    }
}
const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send("No token!");
    }
    let secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
    const token = req.headers.authorization.split(' ')[1];
    try {
        const credential = jsonwebtoken_1.default.verify(token, secretKey);
        if (credential) {
            req.app.locals.credential = credential;
            const userId = credential;
            return next();
        }
    }
    catch (error) {
        return res.send(error);
    }
};
exports.auth = auth;
function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    let secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, payload) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = payload.id;
        next();
    });
}
exports.verifyToken = verifyToken;
exports.default = Authentication;
//# sourceMappingURL=auth.js.map
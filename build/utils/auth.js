"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authentication {
    static generateToken(id, role) {
        const secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
        const payload = { userId: id, role: role };
        const option = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' };
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
function authorization(role) {
    return (req, res, next) => {
        const accessToken = req.cookies.jwt;
        if (!accessToken) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const user = Authentication.validationToken(accessToken);
        if (!user) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        if (user.role !== role) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
}
exports.authorization = authorization;
exports.default = Authentication;
//# sourceMappingURL=auth.js.map
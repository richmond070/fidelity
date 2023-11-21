"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
;
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = require("./utils/auth");
const user_router_1 = require("./users/user.router");
const payment_router_1 = require("./payment/payment.router");
const admin_router_1 = require("./admin/admin.router");
dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET_KEY));
app.use((0, cookie_session_1.default)({ secret: process.env.JWT_SECRET_KEY }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/css', express_1.default.static(path_1.default.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/jquery/dist')));
app.use("/api/users", user_router_1.userRouter);
app.use("/api/deposit", payment_router_1.paymentRouter);
app.use("/api/admin", admin_router_1.adminRouter);
app.use(express_1.default.static('public'));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('home'));
app.get('/homeloggedin', (req, res) => res.render('homeloggedin'));
app.get('/about', (req, res) => res.render('about'));
app.get('/aboutloggedin', (req, res) => res.render('aboutloggedin'));
app.get('/edit', (req, res) => res.render('editprofile'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/plans', (req, res) => res.render('plans'));
app.get('/basic', auth_1.verifyToken, (req, res) => res.render('basic'));
app.get('/estate', auth_1.verifyToken, (req, res) => res.render('estate'));
app.get('/etf', auth_1.verifyToken, (req, res) => res.render('etf'));
app.get('/gold', auth_1.verifyToken, (req, res) => res.render('gold'));
app.get('/immigration', auth_1.verifyToken, (req, res) => res.render('immigration'));
app.get('/insurance', auth_1.verifyToken, (req, res) => res.render('insurance'));
app.get('/merger', auth_1.verifyToken, (req, res) => res.render('merger'));
app.get('/platinum', auth_1.verifyToken, (req, res) => res.render('platinum'));
app.get('/standard', auth_1.verifyToken, (req, res) => res.render('standard'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/dashboard', (req, res) => res.render('dashboard1'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/verify', (req, res) => res.render('verify'));
app.get('/success', (req, res) => res.render('success'));
app.get('/successwithdraw', (req, res) => res.render('successwithdraw'));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=sever.js.map
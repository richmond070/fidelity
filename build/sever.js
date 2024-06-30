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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const PaymentService = __importStar(require("./payment/payment.service"));
const UserService = __importStar(require("./users/users.service"));
const admin_service_1 = require("./admin/admin.service");
const user_router_1 = require("./users/user.router");
const payment_router_1 = require("./payment/payment.router");
const withdraw_router_1 = require("./withdraw/withdraw.router");
const admin_router_1 = require("./admin/admin.router");
const mailRoute_1 = require("./handler/mailRoute");
dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
const httpServer = require('http').createServer(app);
app.use((0, cors_1.default)({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cookie_session_1.default)({ secret: process.env.JWT_SECRET_KEY }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/css', express_1.default.static(path_1.default.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/jquery/dist')));
app.use("/api/user", user_router_1.userRouter);
app.use("/api/deposit", payment_router_1.paymentRouter);
app.use("/api/withdrawal", withdraw_router_1.withdrawRouter);
app.use("/api/admin", admin_router_1.adminRouter);
app.use('/api', mailRoute_1.mailRoute);
app.use(express_1.default.static('public'));
app.use(function (err, req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next(err);
});
app.get('/style.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.sendFile(__dirname + '../public/style.css');
});
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('home'));
app.get('/homeloggedin', (req, res) => res.render('homeloggedin'));
app.get('/migration', (req, res) => res.render('migrationpage'));
app.get('/about', (req, res) => res.render('about'));
app.get('/aboutloggedin', auth_1.verifyToken, (req, res) => res.render('aboutloggedin'));
app.get('/edit', (req, res) => res.render('editprofile'));
app.get('/adminDashboard', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('admin');
}));
app.get('/admin', (req, res) => res.render('adminLogin'));
app.get('/newadmin', (req, res) => res.render("adminsignup"));
app.get('/plans', (req, res) => res.render('plans'));
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('test');
}));
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
app.get('/dashboard', auth_1.verifyToken, (0, auth_1.authorization)('USER'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user;
        const id = parseInt(user, 10);
        const roi = yield PaymentService.calROI(id);
        const deposits = yield PaymentService.listDeposit(id);
        const balance = yield PaymentService.getAvailableBalance(id);
        const users = yield UserService.getUser(id);
        const totalBalance = yield PaymentService.getFinalBalance(id);
        const withdraw = yield PaymentService.totalWithdraws(id);
        console.log('deposit:', deposits);
        console.log('roi:', roi);
        console.log('balance:', balance);
        res.render('dashboard1', { deposits, roi, balance, users, totalBalance, withdraw });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get('/profile', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const id = parseInt(userId, 10);
        const user = yield UserService.getUser(id);
        res.render('profile', { user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get('/contact', (req, res) => res.render('withdrawlaContact'));
app.get('/users', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, admin_service_1.getUsers)(req, res);
}));
app.get('/trans', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, admin_service_1.getAllDeposits)(req, res);
}));
app.get('/adminSignUser', (req, res) => res.render('adminSignUser'));
app.get('/verify', (req, res) => res.render('verify'));
app.get('/success', (req, res) => res.render('success'));
app.get('/successwithdraw', (req, res) => res.render('successwithdraw'));
app.get('/withdraw', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user;
        const id = parseInt(user, 10);
        const roi = yield PaymentService.calROI(id);
        const balance = yield PaymentService.getAvailableBalance(id);
        const users = yield UserService.getUser(id);
        const withdraw = yield PaymentService.totalWithdraws(id);
        res.render('withdrawal', { roi, balance, users, withdraw });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=sever.js.map
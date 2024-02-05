import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";;
import cors from "cors";
import path from 'path';
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";

import http from "http";
import { verifyToken, authorization } from "./utils/auth";
import axios from "axios";
// import * as ws from 'ws';
// import * as socketIo from 'socket.io';
// const { io } = require("socket.io-client");
// import { Server as SocketIOServer } from "socket.io";
// import { initializeSocket } from "./utils/socket";
// import { CustomRequest } from './template/customTemplate'

import * as PaymentService from "./payment/payment.service"
import * as UserService from "./users/users.service"
import { getAllDeposit, getAllDeposits, getUnverifiedDeposits, getUsers } from "./admin/admin.service";

import { userRouter } from "./users/user.router";
import { paymentRouter, } from "./payment/payment.router";
// import { getROI } from "./payment/payment.router";
// import { transactionRouter } from "./transaction/transaction.router";

import { cookie } from "express-validator";
import { adminRouter } from "./admin/admin.router";
import { prisma } from "./utils/db.sever";
// import emailrouter from "./handler/mailRoute";
import { mailRoute } from "./handler/mailRoute";




dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const httpServer = require('http').createServer(app)

// const server = http.createServer(app)

// const socket = io('http://localhost:5000')

// connect socket 
// const Socket = new SocketIOServer(httpServer)/

// Initialize Socket.IO and make it available globally
// initializeSocket(httpServer);


// // WebSockets setup
// Socket.on('connection', (socket: any) => {
//     console.log('A user connected');
// });

// // Listen for deposit notifications
// Socket.on('newDeposit', (data: any) => {
//     // Broadcast the new deposit notification to all connected clients
//     io.emit('newDeposit', data);
// });

app.use(
    cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
        //origin: "http://localhost:4000",
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({ secret: process.env.JWT_SECRET_KEY }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


app.use("/api/user", userRouter);
app.use("/api/deposit", paymentRouter);

// app.use("/api/trans", transactionRouter);
app.use("/api/admin", adminRouter)
app.use('/api', mailRoute);
//app.use(userToken);
app.use(express.static('public'));



app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    //res.setHeader('set-cookies', []);

    next();
})

app.get('/style.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.sendFile(__dirname + '../public/style.css');
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('home'));
app.get('/homeloggedin', (req, res) => res.render('homeloggedin'));
app.get('/migration', (req, res) => res.render('migrationpage'));
app.get('/about', (req, res) => res.render('about'));
app.get('/aboutloggedin', verifyToken, (req, res) => res.render('aboutloggedin'));
app.get('/edit', (req, res) => res.render('editprofile'));
app.get('/adminDashboard', async (req, res) => {
    // Call the getAllDeposit function to retrieve deposit data
    await getAllDeposit(req, res);
});
app.get('/admin', (req, res) => res.render('adminLogin'));
app.get('/newadmin', (req, res) => res.render("adminsignup"));
app.get('/plans', (req, res) => res.render('plans'));

app.get('/test', async (req, res) => {
    try {
        const deposit = await prisma.deposit.findMany({
            select: {
                amount: true,
                transactionId: true,
                createdAt: true,
            }
        });
        res.render('test', { deposit })
    } catch (error: any) {
        console.error('Error fetching data from the database:', error.message);
        res.status(500).send('Internal Sever Error');
    }
});

app.get('/basic', verifyToken, (req, res) => res.render('basic'));
app.get('/estate', verifyToken, (req, res) => res.render('estate'));
app.get('/etf', verifyToken, (req, res) => res.render('etf'));
app.get('/gold', verifyToken, (req, res) => res.render('gold'));
app.get('/immigration', verifyToken, (req, res) => res.render('immigration'));
app.get('/insurance', verifyToken, (req, res) => res.render('insurance'));
app.get('/merger', verifyToken, (req, res) => res.render('merger'));
app.get('/platinum', verifyToken, (req, res) => res.render('platinum'));
app.get('/standard', verifyToken, (req, res) => res.render('standard'));

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/dashboard', verifyToken, authorization('USER'), async (req, res) => {
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user;
        const id: number = parseInt(user, 10);
        const roi = await PaymentService.calROI(id)
        const deposits = await PaymentService.listDeposit(id);
        const balance = await PaymentService.getAvailableBalance(id);

        console.log('deposit:', deposits)
        console.log('roi:', roi)
        console.log('balance:', balance)
        // Render the EJS template and pass the data
        res.render('dashboard1', { deposits, roi, balance });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})

// for the return on investment
// app.get('/payment/roi', verifyToken, getROI);

app.get('/profile', verifyToken, async (req, res) => {
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const id: number = parseInt(userId, 10);
        const user = await UserService.getUser(id)

        // Render the EJS template and pass the data
        res.render('profile', { user })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }

})
//app.get('/deposit', verifyToken, (req, res) => res.render('deposit'));

app.get('/contact', (req, res) => res.render('withdrawlaContact'));
app.get('/users', verifyToken, async (req, res) => {
    await getUsers(req, res)
});
app.get('/trans', verifyToken, async (req, res) => {
    await getAllDeposits(req, res)
});
app.get('/adminSignUser', (req, res) => res.render('adminSignUser'));
app.get('/verify', (req, res) => res.render('verify'));
app.get('/success', (req, res) => res.render('success'));
app.get('/successwithdraw', (req, res) => res.render('successwithdraw'));
app.get('/withdraw', (req, res) => res.render('withdrawal'));




httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
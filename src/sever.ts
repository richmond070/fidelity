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
import { Server as WebSocketServer, WebSocket } from 'ws';
import * as socketIo from 'socket.io';
// import { setupWebSocketSever } from "./admin/admin.service";
import { CustomRequest } from './template/customTemplate'

import * as PaymentService from "./payment/payment.service"

import { userRouter } from "./users/user.router";
import { paymentRouter, setupPaymentRoute } from "./payment/payment.router";
// import { transactionRouter } from "./transaction/transaction.router";

import { cookie } from "express-validator";
import { adminRouter } from "./admin/admin.router";
import { prisma } from "./utils/db.sever";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ port: PORT });
const io = new socketIo.Server(server);


wss.on('connection', (ws) => {
    //handle new connection

    ws.on('message', (data) => {
        console.log(`Received message from client: ${data}`);
    })

    ws.send(`Hello, this is sever.ts!`)
})

// //set up WebSocket server
// setupWebSocketSever(wss)

// // Serve the Socket.IO client script
// app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

// //Middleware to upgrade HTTP request to webSocket
// app.use((req: CustomRequest, res: Response, next: NextFunction) => {
//     req.server = wss;
//     next();
// })


// Middleware to check authentication status
app.use('/check-authentication-status', (req, res, next) => {
    verifyToken(req, res, next);
});

app.use(
    cors({
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
// Set up the payment route with WebSocket integration
app.use('/api/deposit', setupPaymentRoute(wss, prisma));

// WebSocket server handling connections
wss.on('connection', (socket: WebSocket) => {
    console.log('WebSocket client connected');

    // Handle disconnect event if needed
    socket.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});
// app.use("/api/trans", transactionRouter);
app.use("/api/admin", adminRouter)
//app.use(userToken);
app.use(express.static('public'));



app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    //res.setHeader('set-cookies', []);

    next();
})

// wss.on('connection', (ws) => {
//     console.log('WebSocket connection opened.');

//     // Send a welcome message to the connected client
//     ws.send('Welcome to the WebSocket server.');

//     // Listen for messages from the client
//     ws.on('message', (message) => {
//         console.log(`Received message: ${message}`);
//     });
// });

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('home'));
app.get('/homeloggedin', (req, res) => res.render('homeloggedin'));
app.get('/about', (req, res) => res.render('about'));
app.get('/aboutloggedin', (req, res) => res.render('aboutloggedin'));
app.get('/edit', (req, res) => res.render('editprofile'));
app.get('/admin', async (req, res) => {
    try {
        const deposit = await prisma.deposit.findMany({
            select: {
                amount: true,
                transactionId: true,
                createdAt: true
            }
        });
        res.render('admin', { deposit })
    } catch (error: any) {
        console.error('Error fetching data from the database:', error.message);
        res.status(500).send('Internal Sever Error');
    }
});
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
app.get('/dashboard', verifyToken, async (req, res) => {
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId: number = req.user;
        const deposits = await PaymentService.listDeposit(userId);

        // Render the EJS template and pass the data
        res.render('dashboard1', { deposits });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})
app.get('/profile', (req, res) => res.render('profile'))
//app.get('/deposit', verifyToken, (req, res) => res.render('deposit'));

app.get('/contact', (req, res) => res.render('contact'));
app.get('/verify', (req, res) => res.render('verify'));
app.get('/success', (req, res) => res.render('success'));
app.get('/successwithdraw', (req, res) => res.render('successwithdraw'));



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
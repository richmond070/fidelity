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



import { userRouter } from "./users/user.router";
import { paymentRouter } from "./payment/payment.router";
// import { transactionRouter } from "./transaction/transaction.router";

import { cookie } from "express-validator";
import { adminRouter } from "./admin/admin.router";


dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(
    cors({
        credentials: true,
        //origin: "http://localhost:4000",
    })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(cookieSession({ secret: process.env.JWT_SECRET_KEY }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


app.use("/api/users", userRouter);
app.use("/api/deposit", paymentRouter);
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


app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('home'));
app.get('/homeloggedin', (req, res) => res.render('homeloggedin'));
app.get('/about', (req, res) => res.render('about'));
app.get('/aboutloggedin', (req, res) => res.render('aboutloggedin'));
app.get('/edit', (req, res) => res.render('editprofile'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/plans', (req, res) => res.render('plans'));


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
app.get('/dashboard', (req, res) => res.render('dashboard1'));
app.get('/profile', (req, res) => res.render('profile'))
//app.get('/deposit', verifyToken, (req, res) => res.render('deposit'));

app.get('/contact', (req, res) => res.render('contact'));
app.get('/verify', (req, res) => res.render('verify'));
app.get('/success', (req, res) => res.render('success'));
app.get('/successwithdraw', (req, res) => res.render('successwithdraw'));



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
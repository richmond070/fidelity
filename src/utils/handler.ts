import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";


// export const userToken = ((req: Request, res: Response, next: NextFunction) => {
//     const jwtCookie = req.cookies.jwt;
//     let secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031"

//     if (jwtCookie) {
//         try {
//             const decoded = jwt.verify(jwtCookie, secretKey);

//             if (decoded) {
//                 res.locals.jwtToken = decoded;
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     next()
// })
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { getUser } from '../users/users.service';

// export const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || 'my-secret';

// export interface CustomRequest extends Request {
//     token: string | JwtPayload;
//     userId?: number;
// }

// export const createToken = (id: number) => {
//     return jwt.sign({id}, SECRET_KEY, {
//         expiresIn: '1 day', 
//     });
// };

// export const auth = async (req: Request, res: Response, next: NextFunction) => {
//     try{
//         const token = req.header('Authorization')?.replace('Bearer', '');

//         if (!token) {
//             throw new Error('Token not found');
//         }

//         const decoded = jwt.verify(token, SECRET_KEY,);
//         (req as CustomRequest).token = decoded;

//         next();
//     }catch (err) {
//         console.log(err)
//         res.status(401).send('Please authenticate');
//     }
// };


// export const authorizeUser = async(req: CustomRequest, res: Response, next: NextFunction) => {
//    const token = req.token;

//    if (!token) {
//     return res.status(401). send("Unauthorized");
//    }

//     try{
//         // Verify the token and extract the user Id 
//         const decoded = jwt.verify(token as string, SECRET_KEY) as {userId: number};

//         req.userId = decoded.userId;

//         next();
//     }catch (error) {
//         console.error(error);
//         res.status(401).send("Unauthorized!!");
//     }
// }


interface Payload {
    userId: number,
    role: "USER" | "ADMIN",
}

declare global {
    namespace Express {
        interface Request {
            user?: Payload; // Extend the Request object to include 'payload' property
        }
    }
}

class Authentication {
    public static generateToken(id: number, role: any): string {
        const secretKey: string = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
        const payload: Payload = { userId: id, role: role };
        const option = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' };

        return jwt.sign(payload, secretKey, option)
    }

    public static validationToken(token: string): Payload | null {
        try {
            const secretKey: string = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031"
            return jwt.verify(token, secretKey) as Payload;
        } catch (error) {
            return null;
        }
    }
}



// function to verify a users token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    // console.log('Cookies:', req.cookies);
    const token = req.cookies.jwt;
    let secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";

    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
    }


    jwt.verify(token, secretKey, (err: any, payload: any) => {
        if (err) {
            //send JSON response for invalid token
            return res.status(401).json({ message: 'Invalid token' })
        } else {
            //JWT is valid; you can access the decoded payload
            const userId = payload.userId
            req.user = userId; // Attach user data to the request object
            next();
        }
    });

    // if (!req.headers['authorization']) return next(res.status(401).send("No token!"))
    // const authHeader = req.headers['authorization']
    // const bearerToken = authHeader.split(' ')
    // const token = bearerToken[1]

    // jwt.verify(token, secretKey, (err: any, payload: any) => {
    //     if (err) {
    //         return next(res.send(err))
    //     }
    //     req.payload = payload.Id
    //     next()
    // })
}



// Middleware for authorization 
export function authorization(role: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.jwt;

        if (!accessToken) {
            return res.status(401).json({ message: 'Access token required' });
        }

        //token verification 
        const user = Authentication.validationToken(accessToken);

        if (!user) {
            return res.status(403).json({ message: 'Invalid access token' });
        }

        //To check if the user has the required role
        if (user.role !== role) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        next();
    };
}




// export const auth = (req: Request, res: Response, next: NextFunction): any => {
//     if (!req.headers.authorization) {
//         return res.status(401).send("No token!")
//     }

//     let secretKey = process.env.JWT_SECRET_KEY || "richmond-ekezie-richard-031";
//     const token: string = req.headers.authorization.split(' ')[1];

//     try {
//         const credential: string | object = jwt.verify(token, secretKey)
//         if (credential) {
//             req.app.locals.credential = credential;
//             const userId = credential
//             return next();
//         }
//     } catch (error) {
//         return res.send(error)
//     }
// }



export default Authentication
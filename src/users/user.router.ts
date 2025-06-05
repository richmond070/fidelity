import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import generateToken from "../utils/auth";
import { verifyToken } from "../utils/auth";
import { userRegistration } from "../template/emailTemplate";

import * as UserService from "./users.service";

export const userRouter = express.Router();

//GET A LIST OF ALL USERS 
userRouter.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await UserService.listUsers()
        return res.status(200).json(users);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

//Get a single user by id 
userRouter.get("/userInfo", verifyToken, async (req: Request, res: Response) => {
    // const id: number = parseInt(req.params.id, 10);
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user
        const id: number = parseInt(userId, 10);
        const user = await UserService.getUser(id)
        if (user) {
            return res.status(200).json(user)
        }
        return res.status(400).json("User could not be found!")
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});

//create a new user 
userRouter.post("/signup",
    body("fullName").isString(), body("userName").isString(),
    body("email").isString(), body("password").isString(), async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = req.body;
            const newUser = await UserService.createUser(user);
            res.status(201).json({
                success: true,
                user: newUser,
                message: 'Sign Up was successful !!!'
            });

            try {
                // email for user registration
                await userRegistration(newUser);
                console.log('Registration email sent successfully');
            } catch (emailError: any) {
                console.error('Failed to send registration email:', emailError)
                return res.status(500).json(emailError.message)
            }
        } catch (error: any) {
            console.error('Error in signup route:', error);
            let statusCode = 500;
            let errorMessage = 'Internal server error';

            if (error.message.includes('userName')) {
                statusCode = 400;
                errorMessage = 'Username has been taken';
            } else if (error.message.includes('email')) {
                statusCode = 400;
                errorMessage = 'Email is already in use';
            }

            return res.status(statusCode).json({ message: errorMessage });
        }
    });


//Updating a users information
userRouter.put("/update", body("userName").optional(), body("email").optional(),
    body("password").optional(), verifyToken, async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user
        const id: number = parseInt(userId, 10);
        try {
            const user = req.body
            const updatedUser = await UserService.updateUser(user, id)
            return res.status(200).json({
                updatedUser,
                message: "Update successful"
            })
        } catch (error: any) {
            console.error('Error in update  route:', error);
            let statusCode = 500;
            let errorMessage = 'Internal server error';

            if (error.message.includes('userName')) {
                statusCode = 400;
                errorMessage = 'Username has been taken';
            } else if (error.message.includes('email')) {
                statusCode = 400;
                errorMessage = 'Email is already in use';
            }

            return res.status(statusCode).json({ message: errorMessage });
        }
    });

//deleting  a user based on the id 
userRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        await UserService.deleteUser(id)
        return res.status(204).json("User has been deleted successfully!!")
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})


userRouter.delete("/", async (req: Request, res: Response) => {
    try {
        await UserService.deleteAllUsers()
        return res.status(204).json("Users deleted successfully");
    } catch (error: any) {
        console.log("error:", error)
        return res.status(500).json({ message: "Error deleting transaction numbers" });
    }
})

//POST: to log a user in
userRouter.post("/login", async (req: Request, res: Response) => {

    try {
        const { userName, password } = req.body;
        const token = await UserService.logUser(userName, password);
        if (token === "") {
            return res.status(400).json({
                status: "Bad Request!",
                message: "Wrong username or Password"
            })
        }
        //const res_token = { type: "Bearer", token: token }
        res.cookie('jwt', token,
            { httpOnly: true }
        );

        return res.status(200).json({
            status: "OK!",
            message: "Successfully login",
            result: token,
            redirectUrl: '/login'
        });


    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "Internal Server Error",
            message: error.message || 'An unexpected error occurred'
        })
    }
})


userRouter.post("/findUser", async (req: Request, res: Response) => {

    try {
        const { email } = req.body;
        const token = await UserService.findUser(email);
        if (token === "") {
            return res.status(400).json({
                status: "Bad Request!",
                message: "Wrong Email "
            })
        }
        //const res_token = { type: "Bearer", token: token }
        res.cookie('jwt', token,
            { httpOnly: true }
        );



        return res.status(200).json({
            status: "OK!",
            message: "Your account was found",
            result: token,
            redirectUrl: '/updatePassword'
        });


    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            status: "Internal Server Error",
            message: error.message || 'An unexpected error occurred'
        })
    }
})

// to update password
userRouter.put("/updatePassword", body("password").isString(), verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Type guard to narrow down the type

    const userId = req.user
    if (typeof userId !== 'number') {
        return res.status(403).json({ message: 'Invalid user ID' });
    }

    const { password } = req.body
    //const id: number = parseInt(userId, 10);
    try {
        await UserService.updatePassword(userId, password);
        // const user = req.body
        // const updatedUser = await UserService.updateUser(user, id)
        return res.status(200).json({ message: 'Password updated successfully' })
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});

import Authentication from "../utils/auth";
import { prisma } from "../utils/db.sever";
import { generateHash, compareHash } from "../utils/password";
import * as bcrypt from 'bcrypt';

export type User = {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: any,
};

type logUser = {
    userName: string;
    password: string;
};

export const listUsers = async (): Promise<User[]> => {
    const defaultRole = 'USER';
    return prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true,
        },
    });
};

export const getUser = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        }, select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true
        }
    });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
    const { fullName, userName, email, password } = user;

    const hashedPassword = await generateHash(password);
    const defaultRole = 'USER';
    return prisma.user.create({
        data: {
            fullName,
            userName,
            email,
            password: hashedPassword,
            role: defaultRole
        },
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true
        },
    });
};

export const updateUser = async (
    user: Omit<User, "id">,
    id: number
): Promise<User> => {
    const { userName, email, password } = user;
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            userName,
            email,
            password,
        },
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true
        },
    });
};

export const deleteUser = async (id: number): Promise<void> => {
    await prisma.user.delete({
        where: {
            id,
        },
    });
};

//DELETE MANY transaction numbers
export const deleteAllUsers = async (): Promise<void> => {
    await prisma.user.deleteMany()
}

export async function logUser(
    userName: string,
    password: string
): Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userName: userName,
            },
        });

        if (!user) {
            throw new Error("Username is not correct!");
        }

        const passwordMatch = await compareHash(password, user.password);
        if (passwordMatch) {

            return Authentication.generateToken(
                user.id,
                user.role,
            );
        }
        // return "";
        else {
            throw new Error('Password is not correct!')
        }
    } catch (error) {
        throw error;
    }
}


// function to authenticate user with just username or email
export async function findUser(
    userName: string
): Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userName: userName,
            },
        });

        if (!user) {
            throw new Error("Username is not correct!");
        }
        else {
            return Authentication.generateToken(
                user.id,
                user.role,
            );
        }

    } catch (error) {
        throw error;
    }
}

//update the password
export const updatePassword = async (userId: number, newPassword: string): Promise<void> => {
    const hashedPassword = await generateHash(newPassword);
    console.log(`Hashed password ${hashedPassword}`)
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword
        }
    });
};
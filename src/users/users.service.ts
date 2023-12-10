import Authentication from "../utils/auth";
import { prisma } from "../utils/db.sever";
import { generateHash, compareHash } from "../utils/password";

export type User = {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: any,
};

type logUser = {
    email: string;
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
    email: string,
    password: string
): Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error("Email is not correct!");
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

import Authentication from "../utils/auth";
import { prisma } from "../utils/db.sever";
import { generateHash, compareHash } from "../utils/password";

export type User = {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    password: string;
};

type UserLog = {
    email: string;
    password: string;
};

export const listUsers = async (): Promise<User[]> => {
    return prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
        },
    });
};

export const getUser = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
    const { fullName, userName, email, password } = user;

    const hashedPassword = await generateHash(password);

    return prisma.user.create({
        data: {
            fullName,
            userName,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
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
            // const token = jwt.sign({userId: user.id}, SECRET_KEY, {
            //     expiresIn: '1 day',
            // })
            // return token;

            return Authentication.generateToken(
                user.id,
                user.userName,
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

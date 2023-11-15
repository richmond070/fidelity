import { Router } from "express";
import {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    getTransaction,
    deposit,
    createAdmin,
    getAdmin,
    getAdmins,
    logAdmin,
    deleteAdmin
} from "./admin.service";
import { authorization } from "../utils/auth";

export const adminRouter = Router();

adminRouter.post("/user", createUser);
adminRouter.get("/user", getUser);
adminRouter.get("/users", getUsers);
adminRouter.delete("/user:id", deleteUser);


adminRouter.get("/transaction", getTransaction);


adminRouter.post("/deposit", deposit);


adminRouter.post("/admin", createAdmin);
adminRouter.get("/admin/:id", getAdmin);
adminRouter.get("/admins", authorization('ADMIN'), getAdmins);
adminRouter.post("/login", logAdmin);
adminRouter.delete("/admin:id", deleteAdmin);


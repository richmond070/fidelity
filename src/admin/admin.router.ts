import { Router } from "express";
import {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    //getTransaction,
    deposit,
    createAdmin,
    getAdmin,
    getAdmins,
    logAdmin,
    deleteAdmin,
    getAllDeposit,
    getAllDeposits,
    verifyDeposit,
    // getUnverifiedDeposits,
} from "./admin.service";
import { authorization } from "../utils/auth";

export const adminRouter = Router();

adminRouter.post("/user", createUser);
adminRouter.get("/user", getUser);
adminRouter.get("/users", getUsers);
adminRouter.delete("/user:id", deleteUser);


// adminRouter.get("/transaction", getTransaction);


adminRouter.post("/deposit", deposit);
adminRouter.get("/getDeposit", getAllDeposit);
adminRouter.get("/deposits", getAllDeposits)


adminRouter.post("/admin", createAdmin);
adminRouter.get("/admin/:id", getAdmin);
adminRouter.get("/admins", getAdmins);
adminRouter.post("/login", logAdmin);
adminRouter.delete("/admin:id", deleteAdmin);

// API endpoint to get unverified deposits
adminRouter.get('/unverified-deposits', authorization('ADMIN'));

// API endpoint to verify a deposit
adminRouter.post('/verify-deposit', authorization('ADMIN'), verifyDeposit);
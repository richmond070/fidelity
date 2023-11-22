"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_service_1 = require("./admin.service");
const auth_1 = require("../utils/auth");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.post("/user", admin_service_1.createUser);
exports.adminRouter.get("/user", admin_service_1.getUser);
exports.adminRouter.get("/users", admin_service_1.getUsers);
exports.adminRouter.delete("/user:id", admin_service_1.deleteUser);
exports.adminRouter.post("/deposit", admin_service_1.deposit);
exports.adminRouter.post("/admin", admin_service_1.createAdmin);
exports.adminRouter.get("/admin/:id", admin_service_1.getAdmin);
exports.adminRouter.get("/admins", (0, auth_1.authorization)('ADMIN'), admin_service_1.getAdmins);
exports.adminRouter.post("/login", admin_service_1.logAdmin);
exports.adminRouter.delete("/admin:id", admin_service_1.deleteAdmin);
//# sourceMappingURL=admin.router.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketInstance = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let ioInstance;
const initializeSocket = (server) => {
    ioInstance = new socket_io_1.Server(server);
    return ioInstance;
};
exports.initializeSocket = initializeSocket;
const getSocketInstance = () => {
    if (!ioInstance) {
        throw new Error('Socket.IO not initialized');
    }
    return ioInstance;
};
exports.getSocketInstance = getSocketInstance;
//# sourceMappingURL=socket.js.map
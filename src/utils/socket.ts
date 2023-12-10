// // socket.ts

// import { Server } from 'socket.io';

// let ioInstance: Server;

// export const initializeSocket = (server: any): Server => {
//     ioInstance = new Server(server);
//     return ioInstance;
// };

// export const getSocketInstance = (): Server => {
//     if (!ioInstance) {
//         throw new Error('Socket.IO not initialized');
//     }
//     return ioInstance;
// };

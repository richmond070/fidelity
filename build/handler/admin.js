"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket = (0, socket_io_client_1.default)('ws://localhost:5000');
let newDeposits = [];
socket.on('newDeposit', (data) => {
    console.log('New deposit notification:', data.message);
    newDeposits.push(data);
});
socket.on('connect', () => {
    console.log('Connected to server');
});
socket.on('disconnect', () => {
    console.log('disconnected from server');
});
function showNotification(title, message) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, { body: message });
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permissions) => {
            if (permissions === 'granted') {
                const notification = new Notification(title, { body: message });
            }
        });
    }
}
//# sourceMappingURL=admin.js.map
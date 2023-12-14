// import { Socket } from "socket.io-client";
// import io from 'socket.io-client';

// const socket = io('ws://localhost:5000');

// let newDeposits = []

// socket.on('newDeposit', (data) => {
//     console.log('New deposit notification:', data.message);
//     newDeposits.push(data);

// });

// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// socket.on('disconnect', () => {
//     console.log('disconnected from server')
// });

// function showNotification(title: string, message: string) {
//     if (Notification.permission === 'granted') {
//         // If permission is granted, show the notification
//         const notification = new Notification(title, { body: message })
//     } else if (Notification.permission !== 'denied') {
//         //Request Permission from the user
//         Notification.requestPermission().then((permissions) => {
//             if (permissions === 'granted') {
//                 //If permission is granted, show the notification
//                 const notification = new Notification(title, { body: message });
//             }
//         })
//     }
// }
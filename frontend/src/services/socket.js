import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');

const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'], // Prefer websocket
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export default socket;

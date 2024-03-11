import { createContext } from 'react';
import { io } from 'socket.io-client';
export const socket = io('http://localhost:3050');
export const SocketContext = createContext(socket);
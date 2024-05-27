import { BACKEND_URL } from "@env";
import { io } from "socket.io-client";

export const socket = io(`${BACKEND_URL}:7000`, {
    autoConnect: false,
});

export type socketClient = typeof socket;

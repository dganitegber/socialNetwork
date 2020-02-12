import * as io from "socket.io-client";
import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = store => {
    console.log("in socket.js before", socket);
    if (!socket) {
        socket = io.connect();
        console.log("in socket.js", socket);

        socket.on("my amazing message", msg => {
            console.log("can everyone see this", msg);
        });
        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));
    }
};

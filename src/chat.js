import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import moment from "moment";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    const chatMessage = useSelector(state => state && state.chatMessage);

    console.log("chatmessages", chatMessages);
    const elemRef = useRef();
    useEffect(() => {
        // var current = elemRef.current;
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log();
    }, [chatMessages, chatMessage]);
    const keyCheck = e => {
        // console.log("which key user presses", e.keyCode);
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("what user is typing", e.target.value);
            console.log(socket);
            // socket.emit("my amazing message", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div className="chat">
            <h1> Connect to the world!</h1>
            <div id="chatContainer" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(message => {
                        return (
                            <div key={message.id}>
                                <div className="single">
                                    <div className="techDetails">
                                        <img
                                            className="chat-avatar"
                                            src={message.profpic}
                                        />
                                        <div className="messageWrapper">
                                            <div className="name">
                                                By {message.first}{" "}
                                                {message.last}{" "}
                                            </div>
                                            <div className="timeDate">
                                                At{" "}
                                                {moment(
                                                    message.created_at
                                                ).format("LLL")}
                                            </div>
                                            <div className="messageContent">
                                                {message.msg}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                className="writeMessage"
                placeholder="add message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}

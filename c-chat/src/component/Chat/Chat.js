import React, { useEffect, useState } from 'react';
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

const ENDPOINT = "http://localhost:4000/";

const Chat = () => {
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([]);

    const send = () => {
        const message = document.getElementById('chatInput').value;
        if (message.trim()) {
            socket.emit('message', { message, id });
            document.getElementById('chatInput').value = "";
        }
    };

    useEffect(() => {
        socket = socketIo(ENDPOINT, { transports: ['websocket'] });

        socket.on('connect', () => {
            alert('Connected');
            console.log('Socket ID:', socket.id);
            setid(socket.id);
        });

        socket.emit('joined', { user });

        socket.on('welcome', (data) => {
            setMessages((messages) => [...messages, data]);
        });

        socket.on('userJoined', (data) => {
            setMessages((messages) => [...messages, data]);
        });

        socket.on('leave', (data) => {
            setMessages((messages) => [...messages, data]);
        });

        return () => {
            socket.disconnect(); // Disconnects the socket
            socket.off(); // Removes all listeners
        };
    }, []);

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages((messages) => [...messages, data]);
        });

        return () => {
       
            socket.off('sendMessage'); // Clean up listener
        };
    }, []);

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>C CHAT</h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                {messages.map((item, i) => {
    console.log('Message:', item.message, 'Item ID:', item.id, 'User ID:', id);
    return (
        <Message
            key={i}
            user={item.id === id ? '' : item.user}
            message={item.message}
            classs={item.id === id ? 'right' : 'left'}
        />
    );
})}
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input
                        onKeyDown={(event) => event.key === 'Enter' ? send() : null}
                        type="text"
                        id="chatInput"
                    />
                    <button onClick={send} className="sendBtn">
                        <img src={sendLogo} alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;

import React from 'react';
import userStore from "./Stores/UserStore";
import {useEffect} from "react";

function WebSocketProjChat () {
    const token = userStore((state) => state.token); 

    useEffect(() => {
        if (token) {
            const socket = new WebSocket(
                `ws://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/websocket/application/${token}`
            );

            socket.onopen = () => {
                console.log("WebSocket connected");
            };

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
            };

            socket.onclose = () => {
                console.log("WebSocket disconnected");
            };

            socket.onerror = (error) => {
                console.error("WebSocket error", error);
            };

            return () => {
                socket.close();
            };
        }
    }
    , [token]);
}

export default WebSocketProjChat;

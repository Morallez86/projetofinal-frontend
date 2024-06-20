// src/WebSocketContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import userStore from "./Stores/UserStore";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const token = userStore((state) => state.token);
  const [ws, setWs] = useState(null);

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

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [token]);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

// src/WebSocketContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import userStore from "./Stores/UserStore";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const token = userStore((state) => state.token); // Fetches the token from the user store
  const [ws, setWs] = useState(null); // State to hold the WebSocket connection
  const [messageHandlers, setMessageHandlers] = useState([]); // State to manage message event handlers

  useEffect(() => {
    // Effect hook to establish and manage WebSocket connection
    if (token) {
      const socket = new WebSocket(
        `ws://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/websocket/application/${token}`
      );

      // WebSocket event handlers
      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        // Execute all registered message handlers for incoming messages
        messageHandlers.forEach((handler) => handler(message));
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      setWs(socket); // Set the WebSocket instance to state

      // Cleanup function to close the WebSocket connection
      return () => {
        socket.close();
      };
    }
  }, [token, messageHandlers]);

  // Registers a new message handler
  const registerMessageHandler = useCallback((handler) => {
    setMessageHandlers((prevHandlers) => [...prevHandlers, handler]);
  }, []);

  // Unregisters an existing message handler
  const unregisterMessageHandler = useCallback((handler) => {
    setMessageHandlers((prevHandlers) =>
      prevHandlers.filter((h) => h !== handler)
    );
  }, []);

  // Provides WebSocket context to child components
  return (
    <WebSocketContext.Provider
      value={{ ws, registerMessageHandler, unregisterMessageHandler }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to access WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

import React from "react";
import { useEffect } from "react";

function WebSocketProjChat(token, onMessageChat) {

  
  
  useEffect(() => {
    if (token) {
      const socket = new WebSocket(
        `ws://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/websocket/projectChat/${token}`
      );

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
      
       
        const date = new Date(message.timestamp);
      
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1; 
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
      
        
        message.timestamp = [year, month, day, hour, minute];
      
        onMessageChat(message);
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
  }, [token]);
}

export default WebSocketProjChat;

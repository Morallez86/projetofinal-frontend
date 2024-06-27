import React, { useEffect } from "react";

function WebSocketProjChat(projectId, token, onMessageChat, reopenSocket) {

  useEffect(() => {
    const connectWebSocket = () => {
      if (token && projectId) {
        const socket = new WebSocket(
          `ws://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/websocket/projectChat/${projectId}/${token}`
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
          {
            /* if (reopenSocket) {
            setTimeout(connectWebSocket, 1000); 
          }*/
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket error", error);
        };

        return () => socket.close();
      }
    };

    connectWebSocket();

  }, [projectId, token, reopenSocket, onMessageChat]);

  return null; 
}

export default WebSocketProjChat;
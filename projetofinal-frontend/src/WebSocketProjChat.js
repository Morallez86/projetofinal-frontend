import { useEffect } from "react";

function WebSocketProjChat(projectId, token, onMessageChat) {

  

  useEffect(() => {
    const connectWebSocket = () => {
      
      if (token && projectId) {
        const socket = new WebSocket(
          `ws://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/websocket/projectChat/${projectId}/${token}`
        );

        socket.onopen = () => {
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);

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
        };

        socket.onerror = () => {
        };

        return () => socket.close();
      }
    };

    connectWebSocket();

  }, []);

  return null; 
}

export default WebSocketProjChat;
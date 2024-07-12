import React from "react";
import basePhoto from "../Assets/defaultAvatar.jpg";
import { TbEyeSearch } from "react-icons/tb";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,

  AvatarGroup,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { Tooltip } from "react-tooltip";
import useUserStore from "../Stores/UserStore";
import { useParams } from "react-router-dom";
import useApiStore from "../Stores/ApiStore";
import { useTranslation } from "react-i18next";


import WebSocketProjChat from "../WebSocketProjChat";

function GroupProjectChat({
  photos,
  users,
  messages: initialMessages,
  changeParent,
}) {
  const [isSeparated, setIsSeparated] = useState(false); // Separar avatares
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const { projectId } = useParams(); // Obter o ID do projeto
  const [messages, setMessages] = useState(initialMessages); // Inicializar as mensagens
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  const { t } = useTranslation(); // Traduzir o texto



  const onMessageChat = (message) => { // Função para lidar com as mensagens
    
    setMessages((prevMessages) => [ // Adicionar a mensagem ao estado
      ...prevMessages,
      (message = {
        content: message.content,
        senderUsername: message.senderUsername,
        senderId: message.senderId,
        senderOnline: message.senderOnline,
        projectId: message.projectId,
        timestamp: message.timestamp,
      }),
    ]);

    changeParent((prevMessages) => [ // Adicionar a mensagem ao estado do componente pai
      ...prevMessages,
      (message = {
        content: message.content,
        senderUsername: message.senderUsername,
        senderId: message.senderId,
        senderOnline: message.senderOnline,
        projectId: message.projectId,
        timestamp: message.timestamp,
      }),
    ]);

  };

  WebSocketProjChat(projectId, token, onMessageChat); // Inicializar o WebSocket

  let userIdFromToken; // ID do utilizador
  let usernameFromToken; // Nome do utilizador

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decodificar o token
      userIdFromToken = decodedToken.id;  // Obter o ID do utilizador
      usernameFromToken = decodedToken.username; // Obter o nome do utilizador
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const handleSubmit = (message) => { // Função para submeter a mensagem
    fetch(`${apiUrl}/projects/createChatMsg`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId: projectId,
        content: message,
        senderUsername: usernameFromToken,
        senderId: userIdFromToken,
        senderOnline: true,
      }),
    })
      .then(async (response) => {
        if (response.status === 201) { // Se a resposta for 201
          const messageData = await response.json();
          if (messageData.timestamp.length > 5) { // Se o tamanho do timestamp for maior que 5
            messageData.timestamp = messageData.timestamp.slice(0, 5);
          }
        
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Lidar com o timeout da sessão
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else {
          console.log("msg not created", response.status);
        }
      })
      .catch((error) => {
        console.error("Error creating message:", error);
      });
  };

  const convertTimestampToDate = (timestamp) => { // Função para converter o timestamp para data
    return new Date(
      timestamp[0],
      timestamp[1] - 1,
      timestamp[2],
      timestamp[3],
      timestamp[4]
    );
  };

  const avatarStyle = isSeparated
    ? { margin: "10px", transition: "margin 0.5s" }
    : { transition: "margin 0.5s" };

  const joinUsername = (content, username) => {
    return `<strong>${username}</strong>: ${content}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        height: "500px",
        width: "400px",
        bottom: "60px",
        right: "90px",
        border: "5px solid black",
        display: "flex",
        flexDirection: "row",
        zIndex: 1000,
      }}
    >
      <div
        className=" bg-slate-500 overscroll-y-auto "
        style={{
          width: "100px",
          borderRight: "1px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <button onClick={() => setIsSeparated(!isSeparated)} id="eye-icon">
          <TbEyeSearch size={60} />
        </button>
        <Tooltip
          place="top"
          content="Separate Avatars"
          anchorSelect="#eye-icon"
        />
       <AvatarGroup size="md" hoverToFront={true}>
  {users.filter(user => user.active).map((user) => (
    <Avatar
      key={user.userId}
      src={
        photos[user.userId]
          ? `data:${photos[user.userId].type};base64,${
              photos[user.userId].image
            }`
          : basePhoto
      }
      alt={`${user.username}'s profile`}
      style={avatarStyle}
      title={user.username}
      status={user.online ? "available" : "dnd"}
    />
  ))}
</AvatarGroup>
      </div>
      <ChatContainer
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ConversationHeader>
          <ConversationHeader.Content info={t('ProjectChat')} />
        </ConversationHeader>
        {/*typingIndicator={<TypingIndicator content="Emily is typing" />}*/}
        <MessageList>
          {messages.map((msg, index) => {
            const currentMsgDate = convertTimestampToDate(msg.timestamp);

            const prevMsgDate =
              index > 0
                ? convertTimestampToDate(messages[index - 1].timestamp)
                : null;
            const isNewDay =
              index === 0 ||
              (prevMsgDate &&
                currentMsgDate.toDateString() !== prevMsgDate.toDateString());
            const formattedTime = `${currentMsgDate
              .getHours()
              .toString()
              .padStart(2, "0")}:${currentMsgDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
            return (
              <>
                {isNewDay && (
                  <MessageSeparator
                    content={`Day changed to ${currentMsgDate.toDateString()}`}
                  />
                )}
                <Message
                  key={index}
                  model={{
                    message: joinUsername(msg.content, msg.senderUsername),
                    direction:
                      userIdFromToken === msg.senderId
                        ? "outgoing"
                        : "incoming",
                    position: "single",
                    sender: msg.senderUsername,
                  }}
                >
                  <Avatar
                    name={msg.senderUsername}
                    src={
                      photos[msg.senderId]
                        ? `data:${photos[msg.senderId].type};base64,${
                            photos[msg.senderId].image
                          }`
                        : basePhoto
                    }
                    status={msg.senderOnline ? "available" : "dnd"}
                  />
                </Message>
                <span
                  style={{
                    marginLeft:
                      userIdFromToken === msg.senderId ? "12rem" : "3.25rem",
                  }}
                  className="-mt-2 text-gray-400 text-xs"
                >
                  {formattedTime}
                </span>{" "}
              </>
            );
          })}
        </MessageList>
        <MessageInput
          placeholder= {t('TypeYourMessageHere')}
          onSend={(message) => handleSubmit(message)}
        />
      </ChatContainer>
    </div>
  );
}

export default GroupProjectChat;

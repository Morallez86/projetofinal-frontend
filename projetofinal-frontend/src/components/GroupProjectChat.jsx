import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import basePhoto from "../Assets/092.png";
import { TbEyeSearch } from "react-icons/tb";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  TypingIndicator,
  AvatarGroup,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { Tooltip } from "react-tooltip";
import useUserStore from "../Stores/UserStore";
import { useParams } from "react-router-dom";
import useApiStore from "../Stores/ApiStore";
import { useEffect } from "react";
import WebSocketProjChat from "../WebSocketProjChat";

function GroupProjectChat({
  photos,
  users,
  messages: initialMessages,
  changeParent,
}) {
  const [isSeparated, setIsSeparated] = useState(false);
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { projectId } = useParams();
  const [messages, setMessages] = useState(initialMessages);
  const [reopenSocket, setReopenSocket] = useState(true);
  const [firstMessage, setFirstMessage] = useState(true);

  const onMessageChat = (message) => {
    console.log("called");
    setMessages((prevMessages) => [
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

    changeParent((prevMessages) => [
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

    setFirstMessage(false);
  };

  WebSocketProjChat(projectId, token, onMessageChat, reopenSocket);

  let userIdFromToken;
  let usernameFromToken;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userIdFromToken = decodedToken.id;
      usernameFromToken = decodedToken.username;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const handleSubmit = (message) => {
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
        if (response.status === 201) {
          const messageData = await response.json();
          console.log(messageData);
          if (messageData.timestamp.length > 5) {
            messageData.timestamp = messageData.timestamp.slice(0, 5);
          }
          console.log(messageData);
          {/*!firstMessage
            ? setMessages((prevMessages) => [...prevMessages, messageData])
            : console.log("first msg");
          !firstMessage ? changeParent((prevMessages) => [...prevMessages, messageData]) : console.log("first msg");*/}

          console.log("msg created");
        } else {
          console.log("msg not created", response.status);
        }
      })
      .catch((error) => {
        console.error("Error creating message:", error);
      });
  };

  const convertTimestampToDate = (timestamp) => {
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
          {users.map((user) => (
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
              status={user.active ? "available" : "dnd"}
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
          <ConversationHeader.Content info="Project Chat" />
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
            console.log(formattedTime);
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
          placeholder="Type message here"
          onSend={(message) => handleSubmit(message)}
        />
      </ChatContainer>
    </div>
  );
}

export default GroupProjectChat;

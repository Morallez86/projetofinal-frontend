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
} from "@chatscope/chat-ui-kit-react";
import { Tooltip } from "react-tooltip";
import useUserStore from "../Stores/UserStore";

function GroupProjectChat({ photos, users, messages }) {
  const [isSeparated, setIsSeparated] = useState(false);
  const token = useUserStore((state) => state.token);

  let userIdFromToken;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userIdFromToken = decodedToken.id;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const avatarStyle = isSeparated
    ? { margin: "10px", transition: "margin 0.5s" }
    : { transition: "margin 0.5s" };

  return (
    <div
      style={{
        position: "absolute",
        height: "500px",
        width: "400px",
        bottom: "60px",
        right: "90px",
        border: "5px solid black",
        display: "flex",
        flexDirection: "row",
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
          {messages.map((msg, index) => (
            <Message
              key={index}
              model={{
                message: msg.content,
                direction:
                userIdFromToken === msg.sender.id ? "outgoing" : "incoming",
                position: "single",
                sender: msg.sender.username,
                sentTime: msg.timestamp,
              }}
            >  
              <Avatar
                name={msg.sender.username}
                src={
                  photos[msg.sender.id]
                    ? `data:${photos[msg.sender.id].type};base64,${
                        photos[msg.sender.id].image
                      }`
                    : basePhoto
                }
                status={msg.sender.online ? "available" : "dnd"}
              />
            </Message>
          ))}
        </MessageList>
        <MessageInput placeholder="Type message here" />
      </ChatContainer>
    </div>
  );
}

export default GroupProjectChat;

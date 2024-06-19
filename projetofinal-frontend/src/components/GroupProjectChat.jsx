import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import basePhoto from "../Assets/092.png";
import { TbEyeSearch } from "react-icons/tb";
import { useState } from "react";

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

function GroupProjectChat({ photos, users }) {
  const [isSeparated, setIsSeparated] = useState(false);

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
        className=" bg-slate-500  "
        style={{
          width: "100px",
          borderRight: "1px solid black",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button onClick={() => setIsSeparated(!isSeparated)}>
          <TbEyeSearch size={60} />
        </button>

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
        <MessageList
        /*typingIndicator={<TypingIndicator content="Emily is typing" />}*/
        >
          <Message
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "single",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          >
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
          </Message>
          <Message
            model={{
              direction: "outgoing",
              message: "Hello my friend",
              position: "single",
              sener: "Oliver",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            avatarSpacer
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "first",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            avatarSpacer
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "normal",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            avatarSpacer
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "normal",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "last",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          >
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
          </Message>
          <Message
            model={{
              direction: "outgoing",
              message: "Hello my friend",
              position: "first",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            model={{
              direction: "outgoing",
              message: "Hello my friend",
              position: "normal",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            model={{
              direction: "outgoing",
              message: "Hello my friend",
              position: "normal",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            model={{
              direction: "outgoing",
              message: "Hello my friend",
              position: "last",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            avatarSpacer
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "first",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          />
          <Message
            model={{
              direction: "incoming",
              message: "Hello my friend",
              position: "last",
              sender: "Emily",
              sentTime: "15 mins ago",
            }}
          >
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
          </Message>
        </MessageList>
        <MessageInput placeholder="Type message here" />
      </ChatContainer>
    </div>
  );
}

export default GroupProjectChat;

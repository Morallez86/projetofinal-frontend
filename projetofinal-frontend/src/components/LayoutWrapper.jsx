import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Footer from "./Footer";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useWebSocket } from "../WebSocketContext";

const LayoutWrapper = () => {
  const location = useLocation();  //obtém a localizaçao atual
  const apiUrl = useApiStore.getState().apiUrl; //obtém o URL da API
  const token = useUserStore((state) => state.token); //obtém o token do utilizador
  const { registerMessageHandler, unregisterMessageHandler } = useWebSocket(); //obtém os handlers de mensagens

  const [unreadMessages, setUnreadMessages] = useState(null); //mensagens não lidas
  const [unreadNotifications, setUnreadNotifications] = useState(null);   //notificações não lidas

  
  const fetchUnreadCounts = useCallback(async () => { //função para obter as contagens não lidas
    if (token) {
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

       
        const messagesResponse = await fetch( //obtém as mensagens não lidas
          `${apiUrl}/messages/unread/count`,
          { headers }
        );
        if (messagesResponse.ok) { //se a resposta for bem-sucedida
          const messagesData = await messagesResponse.json();
          console.log(messagesData)
          setUnreadMessages(messagesData.unreadCount); //atualiza o estado das mensagens não lidas
        } else {
          console.error(
            "Failed to fetch unread messages count:",
            messagesResponse.status
          );
        }

       
        const notificationsResponse = await fetch( //obtém as notificações não lidas
          `${apiUrl}/notifications/unread/count`,
          { headers }
        );
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
         
          setUnreadNotifications(notificationsData.unreadCount); //atualiza o estado das notificações não lidas
        } else {
          console.error(
            "Failed to fetch unread notifications count:",
            notificationsResponse.status
          );
        }
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    }
  }, [apiUrl, token]); //dependências

  useEffect(() => {
    fetchUnreadCounts(); //obtém as contagens não lidas
  }, [fetchUnreadCounts]); //dependências

  useEffect(() => {
    const handleMessage = (message) => { //função para lidar com as mensagens
      if (message.type === "message") {
        fetchUnreadCounts();
      } else if (message.type === "notification") {
        fetchUnreadCounts();
      } else if (message.type === "refresh"){
        fetchUnreadCounts();
      }
    };

    registerMessageHandler(handleMessage);

    return () => { 
      unregisterMessageHandler(handleMessage);
    };
  }, [fetchUnreadCounts, registerMessageHandler, unregisterMessageHandler]); //dependências

  
  let activeTab, activeSubTabProfile, activeSubProjects, activeSubComponents; //abas ativas

  switch (location.pathname) {
    case "/myProjects":
      activeTab = 0;
      activeSubTabProfile = 0;
      break;
    case "/changePassword":
      activeTab = 0;
      activeSubTabProfile = 1;
      break;
    case "/aboutMe":
      activeTab = 0;
      activeSubTabProfile = 2;
      break;
    case "/createNewProject":
      activeTab = 1;
      activeSubProjects = 0;
      break;
    case "/projectsList":
      activeTab = 1;
      activeSubProjects = 1;
      break;
    case "/users":
      activeTab = 1;
      activeSubProjects = 2;
      break;
    case "/components":
      activeTab = 2;
      activeSubComponents = 0;
      break;
    case "/resources":
      activeTab = 2;
      activeSubComponents = 1;
      break;
    default:
      break;
  }

  return (
    <Layout
      activeTab={activeTab}
      activeSubTabProfile={activeSubTabProfile}
      activeSubProjects={activeSubProjects}
      activeSubComponents={activeSubComponents}
      unreadMessages={unreadMessages}
      unreadNotifications={unreadNotifications}
    >
      <Outlet />
      <Footer />
    </Layout>
  );
};

export default LayoutWrapper;

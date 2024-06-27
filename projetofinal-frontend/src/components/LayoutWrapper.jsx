import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Footer from "./Footer";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useWebSocket } from "../WebSocketContext";

const LayoutWrapper = () => {
  const location = useLocation();
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);
  const { registerMessageHandler, unregisterMessageHandler } = useWebSocket();

  const [unreadMessages, setUnreadMessages] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(null);

  // Fetch unread counts
  const fetchUnreadCounts = useCallback(async () => {
    if (token) {
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch unread messages count
        const messagesResponse = await fetch(
          `${apiUrl}/messages/unread/count`,
          { headers }
        );
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          console.log(messagesData)
          setUnreadMessages(messagesData.unreadCount);
        } else {
          console.error(
            "Failed to fetch unread messages count:",
            messagesResponse.status
          );
        }

        // Fetch unread notifications count
        const notificationsResponse = await fetch(
          `${apiUrl}/notifications/unread/count`,
          { headers }
        );
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          console.log(notificationsData);
          setUnreadNotifications(notificationsData.unreadCount);
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
  }, [apiUrl, token]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  useEffect(() => {
    const handleMessage = (message) => {
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
  }, [fetchUnreadCounts, registerMessageHandler, unregisterMessageHandler]);

  // Define the activeTab and subTabs based on the current path
  let activeTab, activeSubTabProfile, activeSubProjects, activeSubComponents;

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

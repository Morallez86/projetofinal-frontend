import React from "react";
import "../general.css";
import LogoutButton from "../Components/LogoutButton";
import { Link } from "react-router-dom";
import Photo from "../Components/Photo";
import { userStore } from "../stores/UserStore";
import MainUsers from "../Components/MainUsers";
import AsideAddUser from "../Components/AsideAddUser";
import EditProfileButton from "../Components/EditProfileButton";
import DataTableUsers from "../Components/DataTableUsers";
import NotificationIcon from "../Components/NotificationIcon";
import translations from "../Translation/translation";
import WebSocketNotification from "../Components/WebSocketNotification";
import { useState } from "react";


function UsersTable() {
  const userPhoto = userStore.getState().userPhoto;
  const firstName = userStore.getState().loginUser.name.split(" ")[0];
  const role = userStore.getState().loginUser.role;
  const notifications = userStore((state) => state.notification);
  const notCheckedNotification = userStore((state) => state.notCheckedNotification);
  const language = userStore((state) => state.language);
  const { tasksLink, deletedTasksLink, dashboardLink, usersLink, usersTableLink } = translations[language];
  const updateNotCheckedNotification = userStore(
    (state) => state.updateNotCheckedNotification
  );
  const token = userStore((state) => state.token);
  const [notCheckedMessages, setNotCheckedMessages] = useState(
    notCheckedNotification
  );

  const onNotificationReceived = (notification) => {
    console.log("receive", notification);
    
    setNotCheckedMessages((prevNotifications) => {
      const updatedNotifications = [
        ...prevNotifications,
        {
          text: notification.text,
          user: notification.user,
          notificationDateTime: notification.notificationDateTime,
          checked: notification.checked,
          id: notification.id,
        },
      ];
  
      updateNotCheckedNotification(updatedNotifications); 
      return updatedNotifications; 
    });
  };
  WebSocketNotification(token, onNotificationReceived);


  return (
    <div className="App" id="outer-container">
      <header className="header" id="header-app">
        <h1>Scrum Board</h1>
        <div className="links">
        <h2 className="tasks-link">
            <Link to="/htmlDefault "> {tasksLink} </Link>
          </h2>
          <h2 className="users-link">
            {(role === "Owner") && (
              <Link to="/users">{usersLink}</Link>
            )}
          </h2>
          <h2 className="usersTable-link">
            <Link to="/usersTable">{usersTableLink}</Link>
          </h2>

          <h2 className="Deleted-tasks-link">
            {(role === "Owner" || role === "user") && (
              <Link to="/deletedTasks"> {deletedTasksLink}</Link>
            )}
          </h2>
          <h2 className="dashboard-link">
            {(role === "Owner") && (
              <Link to="/dashboard">{dashboardLink}</Link>
            )}
          </h2>
        </div>
        <Photo src={userPhoto} variant={1} />
        <h2> {firstName}</h2>
        <NotificationIcon count={notCheckedNotification.length}/>
        <EditProfileButton />
        <LogoutButton />
      </header>
      <div className="container">
        <main className="main" id="main-app">
          <DataTableUsers />
        </main>
      </div>
      <footer className="footer" id="footer-app">
        {/* Conteúdo do footer */}
      </footer>
    </div>
  );
}

export default UsersTable;

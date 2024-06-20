import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MyProfileMyProjects from "./Pages/MyProfileMyProjects";
import MyProfileChangePassword from "./Pages/MyProfileChangePassword";
import MyProfileRegisterSkillInterest from "./Pages/MyProfileRegisterSkillInterest";
import AllProjectsCreateNew from "./Pages/AllProjectsCreateNew";
import ComponentsComponents from "./Pages/ComponentesComponents";
import ComponentsResources from "./Pages/ComponentsResources";
import MyProfileAboutMe from "./Pages/MyProfileAboutMe";
import RegistrationStatusPage from "./Pages/RegistrationStatusPage";
import ForgotPassword from "./Pages/ForgotPassword";
import Login from "./Pages/Login";
import GanttChartPage from "./Pages/GanttChartPage";
import ProjectDetails from "./Pages/ProjectDetails";
import UsersTable from "./Pages/UsersGrid";
import ProfileOtherUsers from "./Pages/ProfileOtherUsers";
import MessagesPage from "./Pages/MessagesPage";
import NotificationPage from "./Pages/NotificationPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element={<App />} />
        <Route path="/myProjects" element={<MyProfileMyProjects />} />
        <Route path="/changePassword" element={<MyProfileChangePassword />} />
        <Route
          path="/registerSkillInterest"
          element={<MyProfileRegisterSkillInterest />}
        />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/createNewProject" element={<AllProjectsCreateNew />} />
        <Route path="/components" element={<ComponentsComponents />} />
        <Route path="/resources" element={<ComponentsResources />} />
        <Route path="/aboutMe" element={<MyProfileAboutMe />} />
        <Route
          path="/registrationStatusPage/:emailToken"
          element={<RegistrationStatusPage />}
        />
        <Route path="/forgotPassword/:token" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myProjects/:projectId" element={<ProjectDetails />} />
        <Route
          path="/myProjects/:projectId/ganttChart"
          element={<GanttChartPage />}
        />
        <Route path="/users" element={<UsersTable />} />
        <Route path="/users/:userId" element={<ProfileOtherUsers />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

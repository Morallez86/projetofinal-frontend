import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyProfile_MyProjects from "./Pages/MyProfile_MyProjects";
import MyProfile_EditProfile from "./Pages/MyProfile_EditProfile";
import MyProfile_RegisterSkillInterest from "./Pages/MyProfile_RegisterSkillInterest";
import MyProfile_Message from "./Pages/MyProfile_Message";
import AllProjects_CreateNew from "./Pages/AllProjects_CreateNew";
import AllProjects_List from "./Pages/AllProjects_List";
import Componentes_Components from "./Pages/Componentes_Components";
import Components_Resources from "./Pages/Components_Resources";
import MyProfile_AboutMe from "./Pages/MyProfile_AboutMe";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element={<App />} />
        <Route path="/home" element={<MyProfileMyProjects />} />
        <Route path="/editProfile" element={<MyProfileEditProfile />} />
        <Route
          path="/registerSkillInterest"
          element={<MyProfileRegisterSkillInterest />}
        />
        <Route path="/messages" element={<MyProfile_Message />} />
        <Route path="/createNewProject" element={<AllProjects_CreateNew />} />
        <Route path="/projectsList" element={<AllProjects_List />} />
        <Route path="/components" element={<Componentes_Components />} />
        <Route path="/resources" element={<Components_Resources />} />
        <Route path="/aboutMe" element={<MyProfile_AboutMe />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

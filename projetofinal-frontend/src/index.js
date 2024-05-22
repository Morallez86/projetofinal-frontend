import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MyProfileMyProjects from "./Pages/MyProfileMyProjects";
import MyProfileEditProfile from "./Pages/MyProfileEditProfile";
import MyProfileRegisterSkillInterest from "./Pages/MyProfileRegisterSkillInterest";
import MyProfileMessage from "./Pages/MyProfileMessage";
import AllProjectsCreateNew from "./Pages/AllProjectsCreateNew";
import AllProjectsList from "./Pages/AllProjectsList";
import ComponentsComponents from "./Pages/ComponentesComponents";
import ComponentsResources from "./Pages/ComponentsResources";
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
        <Route path="/messages" element={<MyProfileMessage />} />
        <Route path="/createNewProject" element={<AllProjectsCreateNew />} />
        <Route path="/projectsList" element={<AllProjectsList />} />
        <Route path="/components" element={<ComponentsComponents />} />
        <Route path="/resources" element={<ComponentsResources />} />
        <Route path="/aboutMe" element={<MyProfile_AboutMe/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

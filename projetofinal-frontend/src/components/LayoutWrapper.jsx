// src/Components/LayoutWrapper.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Footer from "./Footer"


const LayoutWrapper = () => {
  const location = useLocation();

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
    case "/":
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
    >
      <Outlet />
      <Footer />
    </Layout>
  );
};

export default LayoutWrapper;

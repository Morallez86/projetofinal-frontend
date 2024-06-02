// src/Pages/MyProfileMyProjects.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";

function MyProfileMyProjects() {
  const navigate = useNavigate();
  const projects = [
    { id: 1, name: "Project 1", creation_date: "08/04/2024", status: "Pending" },
    { id: 2, name: "Project 2", creation_date: "10/08/2023", status: "Finished" },
  ];

  const handleRowClick = (projectId) => {
    navigate(`/home/${projectId}/ganttChart`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={0}/>
      <ProjectMyProfileTable data={projects} onRowClick={handleRowClick} />
    </div>
  );
}

export default MyProfileMyProjects;

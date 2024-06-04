// src/Pages/MyProfileMyProjects.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";

function MyProfileMyProjects() {
  const navigate = useNavigate();
  const projects = [
    {
      id: 1,
      title: "Project 1",
      status: "Pending",
      approved: false,
      creationDate: "2024-08-04",
      approvedDate: null,
      startingDate: null,
      plannedEndDate: "2024-12-31",
      endDate: null,
    },
    {
      id: 2,
      title: "Project 2",
      status: "Finished",
      approved: true,
      creationDate: "2023-10-08",
      approvedDate: "2023-11-01",
      startingDate: "2023-11-05",
      plannedEndDate: "2024-01-31",
      endDate: "2024-01-30",
    },
  ];

  const handleRowClick = (projectId) => {
    navigate(`/home/${projectId}/ganttChart`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={0}/>
      <div className="p-14">
      <ProjectMyProfileTable data={projects} onRowClick={handleRowClick}  />
      </div>
    </div>
  );
}

export default MyProfileMyProjects;

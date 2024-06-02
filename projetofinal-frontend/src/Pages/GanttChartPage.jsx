// src/Pages/GanttChartPage.js
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const GanttChartPage = () => {
  const { projectId } = useParams();

  const tasks = [
    {
      start: new Date("2024-06-01"),
      end: new Date("2024-06-10"),
      name: `Project ${projectId} Task 1`,
      id: "1",
      type: "task",
      progress: 45,
      dependencies: [],
    },
    {
      start: new Date("2024-06-11"),
      end: new Date("2024-06-20"),
      name: `Project ${projectId} Task 2`,
      id: "2",
      type: "task",
      progress: 30,
      dependencies: ["1"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
    <Layout activeTab={0} activeSubTabProfile={0}/>
      <div className="gantt-container">
        <Gantt tasks={tasks} viewMode={ViewMode.Day} />
      </div>
    </div>
  );
};

export default GanttChartPage;

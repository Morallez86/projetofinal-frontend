import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useState } from "react";

const GanttChartPage = () => {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState(ViewMode.Day);

  const tasks = [
    {
      start: new Date("2024-06-01"),
      end: new Date("2024-06-10"),
      name: `Task 1`,
      id: "1",
      type: "task",
      progress: 45,
      dependencies: [],
      styles: {
        backgroundSelectedColor: "red",
      },
    },
    {
      start: new Date("2024-06-11"),
      end: new Date("2024-06-20"),
      name: `Task 2`,
      id: "2",
      type: "task",
      progress: 30,
      dependencies: ["1"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={0} />
      <div className="gantt-outer-container w-full overflow-auto ml-10 mr-10">
        <div className="gantt-container">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
          </select>
          <Gantt
            tasks={tasks}
            viewMode={viewMode}
            preStepsCount={0}
            rowHeight={25}
            todayColor = "orange"
          />
        </div>
      </div>
    </div>
  );
};

export default GanttChartPage;

import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useState } from "react";
import { useEffect } from "react";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";

const GanttChartPage = () => {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState(ViewMode.Day);

  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    fetch(`${apiUrl}/projects/${projectId}/tasks`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 404) {
          console.log("Project with this ID is not found");
        } else if (response.status === 200) {
          const tasksData = await response.json();
          console.log(tasksData);
          setAllTasks(tasksData);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  let tasks = [];

  if (allTasks && allTasks.length > 0) {
    tasks = allTasks.map((task) => {
      // Converte as datas para o formato Date
      const start = new Date(
        task.plannedStartingDate[0],
        task.plannedStartingDate[1] - 1,
        ...task.plannedStartingDate.slice(2)
      );
      const end = new Date(
        task.plannedEndingDate[0],
        task.plannedEndingDate[1] - 1,
        ...task.plannedEndingDate.slice(2)
      );

      return {
        start: start,
        end: end,
        name: task.title,
        id: task.id.toString(),
        type: "task",
        progress: 0,
        dependencies: [],
        styles: {
          backgroundSelectedColor: "red",
        },
      };
    });
  }

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
          {tasks && tasks.length > 0 && (
          <Gantt
            tasks={tasks}
            viewMode={viewMode}
            preStepsCount={0}
            rowHeight={25}
            todayColor="orange"
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default GanttChartPage;

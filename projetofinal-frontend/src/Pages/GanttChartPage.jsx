import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { Button } from "flowbite-react";
import AddTaskCard from "../Components/AddTaskCard";


const GanttChartPage = () => {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState(ViewMode.Day);

  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [allTasks, setAllTasks] = useState([]);
  const [dependentTaskss, setDependentTaskss] = useState(0);
  const [dependentTasksState, setDependentTasksState] = useState([]);
  const [dependencieTasks, setDependencieTasks] = useState([]);

  const [popUpShow, setPopUpShow] = useState(false);

  const openPopUpCreateTask = () => {
    setPopUpShow(true);
  };

  useEffect(() => {
    if (dependentTaskss !== 0) { // Considerando que 0 é um valor não válido para ID
      const foundTask = allTasks.find(task => task.id === dependentTaskss);
      if (foundTask) {
        console.log("Tarefa encontrada:", foundTask);
        // Atualiza o estado com o array dependentTasks da tarefa encontrada
        setDependentTasksState(foundTask.dependentTasks || []);
        setDependencieTasks(foundTask.dependencies || [])
      } else {
        console.log("Tarefa não encontrada");
      }
    }
  }, [dependentTaskss, allTasks]);

  console.log(dependentTasksState);

   const isDependent = (taskId) => {
    return dependentTasksState.includes(taskId);
  };

  const isDependency = (taskId) => {
    return dependencieTasks.includes(taskId);
  };



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
    console.log("in");
    tasks = allTasks.map((task) => {
      // Verifica se plannedStartingDate é uma string e a converte para array
      const startingDateArray = typeof task.plannedStartingDate === 'string' ?
        task.plannedStartingDate.split('-').map(Number) :
        [...task.plannedStartingDate]; 
      startingDateArray[1] -= 1; 
    
      // Verifica se plannedEndingDate é uma string e a converte para array
      const endingDateArray = typeof task.plannedEndingDate === 'string' ?
        task.plannedEndingDate.split('-').map(Number) :
        [...task.plannedEndingDate];
      endingDateArray[1] -= 1; 
    
      const start = new Date(
        startingDateArray[0],
        startingDateArray[1],
        ...startingDateArray.slice(2)
      );
      const end = new Date(
        endingDateArray[0],
        endingDateArray[1],
        ...endingDateArray.slice(2)
      );
    
     
      return {
        start: start,
        end: end,
        name: task.title,
        id: task.id,
        type: "task",
        progress: 0,
        dependencies: task.dependencies || [],
        styles: {
          backgroundSelectedColor: "red",
          backgroundColor: isDependent(task.id) || isDependency(task.id) ? "red" : "gray",
        },
      };
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="gantt-outer-container w-auto overflow-auto ml-10 mr-10">
        <div className="gantt-container">
          <div className="flex items-center">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="mb-2 mt-1"
            >
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
            </select>
            <Button
              onClick={() => {
                openPopUpCreateTask();
              }}
              className="ml-2 mb-2 mt-1"
            >
              Create New Task
            </Button>
          </div>
          {tasks && tasks.length > 0 && (
            <Gantt
              tasks={tasks}
              viewMode={viewMode}
              preStepsCount={0}
              rowHeight={30}
              todayColor="orange"
              arrowIndent={20} 
              onClick={(task) => setDependentTaskss(task.id)}
            />
          )}
        </div>
      </div>
      <AddTaskCard popUpShow={popUpShow} setPopUpShow={setPopUpShow} setTasks={setAllTasks} />
    </div>
  );
};

export default GanttChartPage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { Button } from "flowbite-react";
import AddTaskCard from "../Components/AddTaskCard";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const OrientationModal = ({ show }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2>Please rotate your device to landscape mode to view the Gantt chart.</h2>
      </div>
    </div>
  );
};

const GanttChartPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState(ViewMode.Day);

  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [allTasks, setAllTasks] = useState([]);
  const [dependentTaskss, setDependentTaskss] = useState(0);
  const [dependentTasksState, setDependentTasksState] = useState([]);
  const [dependencieTasks, setDependencieTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  const decodedToken = jwtDecode(token);
  const username = decodedToken.username;

  const [popUpShow, setPopUpShow] = useState(false);

  const [isFilterActive, setIsFilterActive] = useState(false);

  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [showModal, setShowModal] = useState(!isLandscape);

  useEffect(() => {
    const handleOrientationChange = () => {
      const newIsLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(newIsLandscape);
      setShowModal(!newIsLandscape);
    };

    window.addEventListener('resize', handleOrientationChange);
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const openPopUpCreateTask = () => {
    setPopUpShow(true);
  };

  const filterMyTasks = () => {
    const myTaskIds = allTasks
      .filter((task) => task.userName === username)
      .map((task) => task.id);
    console.log(username);
    console.log(allTasks);
    console.log(myTaskIds);
    setMyTasks(myTaskIds);
    setIsFilterActive(!isFilterActive);
  };

  useEffect(() => {
    if (dependentTaskss !== 0) {
      // Considerando que 0 é um valor não válido para ID
      const foundTask = allTasks.find((task) => task.id === dependentTaskss);
      if (foundTask) {
        console.log("Tarefa encontrada:", foundTask);
        // Atualiza o estado com o array dependentTasks da tarefa encontrada
        setDependentTasksState(foundTask.dependentTasks || []);
        setDependencieTasks(foundTask.dependencies || []);
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

  const isMyTask = (taskId) => {
    return myTasks.includes(taskId);
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
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
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
      const startingDateArray =
        typeof task.plannedStartingDate === "string"
          ? task.plannedStartingDate.split("-").map(Number)
          : [...task.plannedStartingDate];
      startingDateArray[1] -= 1;

      // Verifica se plannedEndingDate é uma string e a converte para array
      const endingDateArray =
        typeof task.plannedEndingDate === "string"
          ? task.plannedEndingDate.split("-").map(Number)
          : [...task.plannedEndingDate];
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
        name: task.title + " Responsible: " + task.userName,
        id: task.id,
        type: "task",
        progress: 0,
        dependencies: task.dependencies || [],
        styles: {
          backgroundSelectedColor: "red",
          backgroundColor:
            isDependent(task.id) ||
            isDependency(task.id) ||
            (isFilterActive && isMyTask(task.id))
              ? "red"
              : "gray",
        },
      };
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
  <div className="gantt-outer-container w-auto overflow-auto mx-auto px-4 sm:px-8 lg:px-10">
    <div className="gantt-container">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="mb-2 mt-1 text-base sm:text-lg"
        >
          <option value={ViewMode.Day}>Day</option>
          <option value={ViewMode.Week}>Week</option>
        </select>
        <Button
          onClick={openPopUpCreateTask}
          className="ml-2 mb-2 mt-1 text-sm sm:text-base"
        >
          Create New Task
        </Button>
        <Button
          onClick={filterMyTasks}
          className="ml-2 mb-2 mt-1 text-sm sm:text-base"
        >
          {isFilterActive ? "Clean" : "Only My Tasks"}
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
          className={`w-full ${isLandscape ? "gantt-landscape" : ""}`}        />
      )}
    </div>
  </div>
  <AddTaskCard
    popUpShow={popUpShow}
    setPopUpShow={setPopUpShow}
    setTasks={setAllTasks}
  />
  <OrientationModal show={showModal} />
</div>
  );
};

export default GanttChartPage;

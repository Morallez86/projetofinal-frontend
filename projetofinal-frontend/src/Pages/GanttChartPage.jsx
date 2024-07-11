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
import { useTranslation } from "react-i18next";



const OrientationModal = ({ show }) => { // Modal de orientação para mobile
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
  const { projectId } = useParams(); // ID do projeto através do URL
  const [viewMode, setViewMode] = useState(ViewMode.Day);  // Modo de visualização
  const { t } = useTranslation(); // Função de tradução

  const apiUrl = useApiStore((state) => state.apiUrl); // URL da API
  const token = useUserStore((state) => state.token); // Token
  const [allTasks, setAllTasks] = useState([]); // Todas as tarefas
  const [dependentTaskss, setDependentTaskss] = useState(0); // Tarefas dependentes
  const [dependentTasksState, setDependentTasksState] = useState([]); // Estado das tarefas dependentes
  const [dependencieTasks, setDependencieTasks] = useState([]); // Tarefas de dependência
  const [myTasks, setMyTasks] = useState([]); // Minhas tarefas

  const decodedToken = jwtDecode(token);  // Decodificar o token
  const username = decodedToken.username; // Nome de utilizador

  const [popUpShow, setPopUpShow] = useState(false); // Pop-up de criação de tarefa

  const [isFilterActive, setIsFilterActive] = useState(false); // Filtro ativo

  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight); // Orientação do dispositivo
  const [showModal, setShowModal] = useState(!isLandscape); // Modal

  useEffect(() => { // Efeito para lidar com a orientação do dispositivo
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

  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const openPopUpCreateTask = () => { // Função para abrir o pop-up de criação de tarefa
    setPopUpShow(true);
  };

  const filterMyTasks = () => { // Função para filtrar as minhas tarefas
    const myTaskIds = allTasks
      .filter((task) => task.userName === username)
      .map((task) => task.id);
  
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

  

  const isDependent = (taskId) => { // Função para verificar se é dependente
    return dependentTasksState.includes(taskId);
  };

  const isDependency = (taskId) => { // Função para verificar se é dependência
    return dependencieTasks.includes(taskId);
  };

  const isMyTask = (taskId) => { // Função para verificar se é a minha tarefa
    return myTasks.includes(taskId);
  };

  useEffect(() => { // Efeito para obter as tarefas
    getTasks();
  }, []);

  const getTasks = () => { // Função para obter as tarefas
    fetch(`${apiUrl}/projects/${projectId}/tasks`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 404) { // Se o status for 404
          console.log("Project with this ID is not found");
        } else if (response.status === 200) { // Se o status for 200
          const tasksData = await response.json();
          console.log(tasksData);
          setAllTasks(tasksData);
        } else if (response.status === 401) { // Se o status for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Lidar com o timeout da sessão
            return; 
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

  // Função para converter data
const convertDateArray = (dateArray) => {
  if (dateArray.length === 7) {
    // Retorna um novo array com ano, mês, dia seguidos de 0 para horas e minutos
    return [dateArray[0], dateArray[1], dateArray[2], 0, 0];
  }
  // Retorna o array original caso não tenha 7 elementos
  // Pode-se lançar um erro ou tratar de outra forma conforme a necessidade
  return dateArray;
};

tasks = allTasks.map((task) => {
  // Converte startingDate ou plannedStartingDate
  const startingDateArray = task.startingDate ? convertDateArray([...task.startingDate]) : 
    (typeof task.plannedStartingDate === "string" ? task.plannedStartingDate.split("-").map(Number) : convertDateArray([...task.plannedStartingDate]));
  startingDateArray[1] -= 1; // Ajusta o mês

  // Converte endingDate ou plannedEndingDate
  const endingDateArray = task.endingDate ? convertDateArray([...task.endingDate]) : 
    (typeof task.plannedEndingDate === "string" ? task.plannedEndingDate.split("-").map(Number) : convertDateArray([...task.plannedEndingDate]));
  endingDateArray[1] -= 1; // Ajusta o mês

  // Verifica se alguma dependentTask tem endingDate posterior e ajusta a startingDateArray se necessário
  if (task.dependencies && task.dependencies.length > 0) {
    let latestDependentEndingDate = new Date(0); // Inicializa com uma data muito antiga
    task.dependencies.forEach(dependentTaskId => {
      const dependentTask = allTasks.find(t => t.id === dependentTaskId);
      if (dependentTask) {
        const dependentEndingDateArray = dependentTask.endingDate ? convertDateArray([...dependentTask.endingDate]) : 
          (typeof dependentTask.plannedEndingDate === "string" ? dependentTask.plannedEndingDate.split("-").map(Number) : convertDateArray([...dependentTask.plannedEndingDate]));
        dependentEndingDateArray[1] -= 1; // Ajusta o mês

        const dependentEndTimestamp = Date.UTC(dependentEndingDateArray[0], dependentEndingDateArray[1], ...dependentEndingDateArray.slice(2));
        const dependentEndDate = new Date(dependentEndTimestamp);

        if (dependentEndDate > latestDependentEndingDate) {
          latestDependentEndingDate = dependentEndDate;
        }
      }
    });

    const currentStartTimestamp = Date.UTC(startingDateArray[0], startingDateArray[1], ...startingDateArray.slice(2));
    if (latestDependentEndingDate.getTime() > currentStartTimestamp) {
      // Ajusta a startingDateArray para um dia depois da latestDependentEndingDate
      latestDependentEndingDate.setDate(latestDependentEndingDate.getDate() + 1);
      startingDateArray[0] = latestDependentEndingDate.getUTCFullYear();
      startingDateArray[1] = latestDependentEndingDate.getUTCMonth();
      startingDateArray[2] = latestDependentEndingDate.getUTCDate();
    }
  }

  const startTimestamp = Date.UTC(startingDateArray[0], startingDateArray[1], ...startingDateArray.slice(2));
  const endTimestamp = Date.UTC(endingDateArray[0], endingDateArray[1], ...endingDateArray.slice(2));

  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);

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
      backgroundColor: isDependent(task.id) || isDependency(task.id) || (isFilterActive && isMyTask(task.id)) ? "red" : "gray",
    },
  };
});

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
        <Button onClick={() => window.history.back()} className="ml-2 mb-2 mt-1 text-sm sm:text-base">
    {t("Back")}
  </Button>
      </div>
      {tasks && tasks.length > 0 && (
        console.log(tasks),
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

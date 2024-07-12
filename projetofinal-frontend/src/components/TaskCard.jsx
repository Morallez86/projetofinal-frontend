// src/Components/TaskCard.js
import React, { useState, useEffect } from "react";
import { Card, TextInput, Textarea, Select, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  FcLowPriority,
  FcMediumPriority,
  FcHighPriority,
} from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useTranslation } from "react-i18next";

const TaskCard = ({
  task,
  projectUsers,
  totalTasks,
  setTotalTasks,
  fetchProjectDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir
  const [editMode, setEditMode] = useState(false); // Estado para editar
  const [isMouseOverInteractiveElement, setIsMouseOverInteractiveElement] =
    useState(false);
  const apiUrl = useApiStore((state) => state.apiUrl); // Api url
  const token = useUserStore((state) => state.token); // Token
  const navigate = useNavigate();
  const { t } = useTranslation(); // Função de tradução
  const handleSessionTimeout = () => {
    // Função para timeout
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };
  const [isModified, setIsModified] = useState(false);

  const checkDependenciesStatus = (taskDependencies) => {
    return taskDependencies.every((dependencyId) => {
      const task = totalTasks.find((t) => t.id === dependencyId);
      return task && task.status === 300;
    });
  };

  const [originalTaskData] = useState({
    // Dados da tarefa originais
    projectId: task.projectId,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    contributors: task.contributors,
    userName: task.userName,
  });

  const [taskData, setTaskData] = useState({
    // Dados da tarefa que podem ser alterados
    projectId: task.projectId,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    contributors: task.contributors,
    userName: task.userName,
  });

  const checkIfTaskIsModified = () => {
    const isModified = Object.keys(originalTaskData).some((key) => {
      // Converte ambos os valores para string para uma comparação consistente, útil para campos como 'status'.
      const originalValue = String(originalTaskData[key]);
      const currentValue = String(taskData[key]);
      return originalValue !== currentValue;
    });
    setIsModified(isModified);
  };

  // UseEffect para chamar a função de comparação sempre que os dados da tarefa forem alterados
  useEffect(() => {
    checkIfTaskIsModified();
  }, [taskData]);

  const handleChange = (event) => {
    // Função para mudar
    const { name, value } = event.target;
    setTaskData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmitClick = () => {
    // Função para submeter
    fetch(`${apiUrl}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    }).then(async (response) => {
      if (response.status === 401) {
        // Se o status for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Chama a função de timeout
          return;
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) {
        // Se não for ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTaskResponse = await response.json();
      const updatedTask = updatedTaskResponse.taskDto;
      const updatedTaskIndex = updatedTaskResponse.index;

      let newTotalTasks = [...totalTasks];
      const originalTaskIndex = newTotalTasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (originalTaskIndex !== -1) {
        newTotalTasks.splice(originalTaskIndex, 1);
      }
      newTotalTasks.splice(updatedTaskIndex, 0, updatedTask);
      setTotalTasks(newTotalTasks);
      setEditMode(false);
      fetchProjectDetails();
    });
  };

  const handleCancelClick = () => {
    // Função para cancelar
    setEditMode(false);

    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      contributors: task.contributors,
      userName: task.userName,
      id: task.id,
    });
    setIsModified(false);
  };

  const formatDate = (dateArray) => {
    // Função para formatar a data
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;

    // Cria um objeto Date em UTC
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // Retorna a data formatada em UTC
    return date.toISOString().split("T")[0];
  };

  const getStatusString = (statusValue) => {
    // Função para obter o status
    switch (statusValue) {
      case 100:
        return t("PLANNED");
      case 200:
        return t("IN PROGRESS");
      case 300:
        return t("FINISHED");
      default:
        return t("UNKNOWN");
    }
  };

  const getPriorityIcon = (priorityValue) => {
    // Função para obter o ícone de prioridade
    switch (priorityValue) {
      case 100:
        return (
          <>
            <FcLowPriority size={30} className="priority-icon" />
            <MdOutlineEdit
              size={30}
              className="edit-icon cursor-pointer"
              onClick={() => {
                setEditMode(true);
                setIsModified(false);
              }}
            />
          </>
        );
      case 200:
        return (
          <>
            <FcMediumPriority size={30} className="priority-icon" />
            <MdOutlineEdit
              size={30}
              className="edit-icon cursor-pointer"
              onClick={() => {
                setEditMode(true);
                setIsModified(false);
              }}
            />
          </>
        );
      case 300:
        return (
          <>
            <FcHighPriority size={30} className="priority-icon" />
            <MdOutlineEdit
              size={30}
              className="edit-icon cursor-pointer"
              onClick={() => {
                setEditMode(true);
                setIsModified(false);
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const getPriorityString = (priorityValue) => {
    // Função para obter a prioridade
    switch (priorityValue) {
      case 100:
        return t("LOW");
      case 200:
        return t("MEDIUM");
      case 300:
        return t("HIGH");
      default:
        return t("UNKNOWN");
    }
  };

  // Função para expandir o card quando o rato entra na área do card
  const handleMouseEnterCard = () => {
    setIsExpanded(true);
  };

  // Função que colapsa o card quando o rato sai da área do card
  // Mas mantém o card expandido se o rato está sobre um elemento interactivo
  const handleMouseLeaveCard = () => {
    if (!isMouseOverInteractiveElement) {
      setIsExpanded(false);
    }
  };

  // Função que marca que o rato está sobre um elemento interactivo
  const handleMouseEnterInteractiveElement = () => {
    setIsMouseOverInteractiveElement(true);
  };

  // Função que marca que o rato saiu de um elemento interactivo
  const handleMouseLeaveInteractiveElement = () => {
    setIsMouseOverInteractiveElement(false);
  };

  return (
    <Card
      className={`relative max-w p-4 mb-4 ${isExpanded ? "expanded" : ""} ${
        task.status === 300 ? "opacity-50" : ""
      }`}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeaveCard}
    >
      <div className="absolute top-0 right-0 mt-2 mr-2">
        {getPriorityIcon(task.priority)}
      </div>
      <h3
        className={`text-xl font-semibold mb-2 ${
          task.status === 300 ? "line-through" : ""
        }`}
      >
        {editMode ? (
          <TextInput
            id="taskTitle"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            onMouseEnter={handleMouseEnterInteractiveElement}
            onMouseLeave={handleMouseLeaveInteractiveElement}
          />
        ) : (
          task.title
        )}
      </h3>
      <div className={`${task.status === 300 ? "line-through" : ""}`}>
        <strong>{t("Description")}:</strong>{" "}
        {editMode ? (
          <Textarea
            id="taskDescription"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            onMouseEnter={handleMouseEnterInteractiveElement}
            onMouseLeave={handleMouseLeaveInteractiveElement}
          />
        ) : (
          task.description
        )}
      </div>
      {isExpanded && (
        <>
          <div>
            <strong>{t("Status")}:</strong>{" "}
            {editMode ? (
              <Select
                id="taskStatus"
                name="status"
                value={taskData.status}
                onChange={handleChange}
                disabled={!checkDependenciesStatus(task.dependencies)}
                onMouseEnter={handleMouseEnterInteractiveElement}
                onMouseLeave={handleMouseLeaveInteractiveElement}
              >
                {task.status === 100 ? (
                  <>
                    <option value="100">{t("PLANNED")}</option>
                    <option value="200">{t("IN PROGRESS")}</option>
                  </>
                ) : (
                  <>
                    <option value="100">{t("PLANNED")}</option>
                    <option value="200">{t("IN PROGRESS")}</option>
                    <option value="300">{t("FINISHED")}</option>
                  </>
                )}
              </Select>
            ) : (
              getStatusString(task.status)
            )}
          </div>
          <div>
            <strong>{t("Priority")}:</strong>{" "}
            {editMode ? (
              <Select
                id="taskPriority"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                onMouseEnter={handleMouseEnterInteractiveElement}
                onMouseLeave={handleMouseLeaveInteractiveElement}
              >
                <option value="100">{t("LOW")}</option>
                <option value="200">{t("MEDIUM")}</option>
                <option value="300">{t("HIGH")}</option>
              </Select>
            ) : (
              getPriorityString(task.priority)
            )}
          </div>
          <div>
            <strong>{t("Planned Start Date:")}</strong>{" "}
            {formatDate(task.plannedStartingDate)}
          </div>
          <div>
            <strong>{t("Planned End Date:")}</strong>{" "}
            {formatDate(task.plannedEndingDate)}
          </div>
          <div>
            <strong>{t("Responsible")}:</strong>{" "}
            {editMode ? (
              <Select
                id="taskResponsible"
                name="userName"
                value={taskData.userName}
                onChange={handleChange}
                onMouseEnter={handleMouseEnterInteractiveElement}
                onMouseLeave={handleMouseLeaveInteractiveElement}
              >
                {projectUsers.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </Select>
            ) : (
              task.userName
            )}
          </div>
          {editMode && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleCancelClick}
                className="mr-2"
                onMouseEnter={handleMouseEnterInteractiveElement}
                onMouseLeave={handleMouseLeaveInteractiveElement}
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={handleSubmitClick}
                onMouseEnter={handleMouseEnterInteractiveElement}
                onMouseLeave={handleMouseLeaveInteractiveElement}
                disabled={!isModified}
              >
                {t("Save")}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default TaskCard;

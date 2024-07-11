// src/Components/TaskCard.js
import React from "react";
import { Card, TextInput, Textarea, Select, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import {
  FcLowPriority,
  FcMediumPriority,
  FcHighPriority,
} from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";

const TaskCard = ({ task, projectUsers, totalTasks, setTotalTasks }) => {
  const [isExpanded, setIsExpanded] = useState(false); //estado para expandir
  const [editMode, setEditMode] = useState(false); //estado para editar
  const apiUrl = useApiStore((state) => state.apiUrl); //api url
  const token = useUserStore((state) => state.token); //token
  const navigate = useNavigate();
  const handleSessionTimeout = () => { //função para timeout
    navigate("/", { state: { showSessionTimeoutModal: true } }); //navegar para a página inicial
  };
  
  console.log(task);
    
  
  const checkDependenciesStatus = (taskDependencies) => {
    return taskDependencies.every(dependencyId => {
      const task = totalTasks.find(t => t.id === dependencyId);
      return task && task.status === 300;
    });
  };


  const [taskData, setTaskData] = useState({ //dados da tarefa
    projectId: task.projectId,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    contributors: task.contributors,
    userName: task.userName,
  });

  const handleChange = (event) => { //função para mudar
    const { name, value } = event.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitClick = () => { //função para submeter
    fetch(`${apiUrl}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    }).then(async (response) => {
      if (response.status === 401) { //se o status for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); //chama a função de timeout
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) { //se não for ok
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
    });
  };

  const handleCancelClick = () => { //função para cancelar
    setEditMode(false);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      contributors: task.contributors,
      userName: task.userName,
    });
  };

  const formatDate = (dateArray) => { //função para formatar a data
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
  
    // Cria um objeto Date em UTC
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  
    // Retorna a data formatada em UTC
    return date.toISOString().split("T")[0];
  };

  const getStatusString = (statusValue) => { //função para obter o status
    switch (statusValue) {
      case 100:
        return "PLANNED";
      case 200:
        return "IN PROGRESS";
      case 300:
        return "FINISHED";
      default:
        return "UNKNOWN";
    }
  };

  const getPriorityIcon = (priorityValue) => { //função para obter o ícone de prioridade
    switch (priorityValue) {
      case 100:
        return (
          <>
            <FcLowPriority size={30} className="priority-icon" />
            <MdOutlineEdit
              size={30}
              className="edit-icon cursor-pointer"
              onClick={() => setEditMode(true)}
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
              onClick={() => setEditMode(true)}
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
              onClick={() => setEditMode(true)}
            />
          </>
        );
      default:
        return null;
    }
  };

  const getPriorityString = (priorityValue) => { //função para obter a prioridade
    switch (priorityValue) {
      case 100:
        return "LOW";
      case 200:
        return "MEDIUM";
      case 300:
        return "HIGH";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <Card
      className={`relative max-w p-4 mb-4 ${isExpanded ? "expanded" : ""} ${
        task.status === 300 ? "opacity-50" : ""
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
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
          />
        ) : (
          task.title
        )}
      </h3>
      <p className={`${task.status === 300 ? "line-through" : ""}`}>
        <strong>Description:</strong>{" "}
        {editMode ? (
          <Textarea
            id="taskDescription"
            name="description"
            value={taskData.description}
            onChange={handleChange}
          />
        ) : (
          task.description
        )}
      </p>
      {isExpanded && (
        <>
         <p>
  <strong>Status:</strong>{" "}
  {editMode ? (
    <Select
      id="taskStatus"
      name="status"
      value={taskData.status}
      onChange={handleChange}
      disabled={!checkDependenciesStatus(task.dependencies)}
    >
      {task.status === 100 ? (
        <>
        <option value="100">PLANNED</option>
        <option value="200">IN PROGRESS</option>
        </>
      ) : (
        <>
          <option value="100">PLANNED</option>
          <option value="200">IN PROGRESS</option>
          <option value="300">FINISHED</option>
        </>
      )}
    </Select>
  ) : (
    getStatusString(task.status)
  )}
</p>
          <p>
            <strong>Priority:</strong>{" "}
            {editMode ? (
              <Select
                id="taskPriority"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
              >
                <option value="100">LOW</option>
                <option value="200">MEDIUM</option>
                <option value="300">HIGH</option>
              </Select>
            ) : (
              getPriorityString(task.priority)
            )}
          </p>
          <p>
            <strong>Planned Start Date:</strong>{" "}
            {formatDate(task.plannedStartingDate)}
          </p>
          <p>
            <strong>Planned End Date:</strong>{" "}
            {formatDate(task.plannedEndingDate)}
          </p>
          <p>
            <strong>Responsible:</strong>{" "}
            {editMode ? (
              <Select
                id="taskResponsible"
                name="userName"
                value={taskData.userName}
                onChange={handleChange}
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
          </p>
          {editMode && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancelClick} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSubmitClick}>Save</Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default TaskCard;

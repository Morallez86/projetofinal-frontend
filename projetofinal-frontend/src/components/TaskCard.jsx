// src/Components/TaskCard.js
import React from "react";
import { Card, TextInput, Textarea, Select, Button } from "flowbite-react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);

  const [taskData, setTaskData] = useState({
    projectId: task.projectId,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    contributors: task.contributors,
    userName: task.userName,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitClick = () => {
    fetch(`${apiUrl}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("task updated successfully");
      const updatedTaskResponse = await response.json();
      const updatedTask = updatedTaskResponse.taskDto;
      const updatedTaskIndex = updatedTaskResponse.index;
      console.log(updatedTaskIndex);

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

  const handleCancelClick = () => {
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

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute)
      .toISOString()
      .split("T")[0];
  };

  console.log(task);
  console.log(projectUsers);

  const getStatusString = (statusValue) => {
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

  const getPriorityIcon = (priorityValue) => {
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

  const getPriorityString = (priorityValue) => {
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
              >
                <option value="100">PLANNED</option>
                <option value="200">IN PROGRESS</option>
                <option value="300">FINISHED</option>
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

// src/Components/TaskCard.js
import React from "react";
import { Card } from "flowbite-react";
import { useState } from "react";
import {
  FcLowPriority,
  FcMediumPriority,
  FcHighPriority,
} from "react-icons/fc";

const TaskCard = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute)
      .toISOString()
      .split("T")[0];
  };

  console.log(task.status);

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
        return <FcLowPriority size={30} className="priority-icon" />;
      case 200:
        return <FcMediumPriority size={30} className="priority-icon" />;
      case 300:
        return <FcHighPriority size={30} className="priority-icon" />;
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
      className={`relative max-w p-4 mb-4 ${isExpanded ? "expanded" : ""} ${task.status === 300 ? 'opacity-50' : ''}`}
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
        {task.title}
      </h3>
      <p className={`${task.status === 300 ? "line-through" : ""}`}>
        <strong>Description:</strong> {task.description}
      </p>
      {isExpanded && (
        <>
          <p>
            <strong>Status:</strong> {getStatusString(task.status)}
          </p>
          <p>
            <strong>Priority:</strong> {getPriorityString(task.priority)}
          </p>
          <p>
            <strong>Planned Start Date:</strong>{" "}
            {formatDate(task.plannedStartingDate)}
          </p>
          <p>
            <strong>Planned End Date:</strong>{" "}
            {formatDate(task.plannedEndingDate)}
          </p>
        </>
      )}
    </Card>
  );
};

export default TaskCard;

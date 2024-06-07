// src/Components/TaskCard.js
import React from "react";
import { Card } from "flowbite-react";

const TaskCard = ({ task }) => {
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute)
      .toISOString()
      .split("T")[0];
  };

  const getStatusString = (statusValue) => {
    switch (statusValue) {
      case 0:
        return "NOT STARTED";
      case 100:
        return "PLANNING";
      case 200:
        return "READY";
      case 300:
        return "IN PROGRESS";
      case 400:
        return "FINISHED";
      case 500:
        return "CANCELLED";
      default:
        return "UNKNOWN";
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
    <Card className="max-w p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
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
        <strong>Planned End Date:</strong> {formatDate(task.plannedEndingDate)}
      </p>
    </Card>
  );
};

export default TaskCard;

import React from "react";
import { Button } from "flowbite-react";
import CreateLogModal from "./CreateLogModal";
import { useState } from "react";

function ActivityLogs({ tasks, projectId, logs }) {
  const [showModal, setShowModal] = useState(false);
  const [totalLogs, setTotalLogs] = useState(logs);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const logColors = {
    100: "bg-blue-300",
    200: "bg-yellow-300",
    300: "bg-red-400",
    400: "bg-orange-400",
    500: "bg-gray-400",
  };

  return (
    <div className="flex flex-col items-center space-y-4 rounded-md bg-white">
      <h1 className="text-4xl font-bold underline mb-4">Activity Log</h1>
      <div className="overflow-auto space-y-4 h-[30rem]">
        {totalLogs.map((log) => {
          const date = new Date(...log.timestamp);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString().slice(0, 5); 
          const shortDescription = log.newDescription.length > 15
          ? log.newDescription.slice(0, 15) + "(...)"
          : log.newDescription;
          return (
            <div
              key={log.id}
              className={`w-72 h-24 rounded-md ${logColors[log.type]}`}
            >
              <p className="text-center">{shortDescription}</p>
              <p className="text-center">{formattedDate}</p>
              <p className="text-center">{formattedTime}</p>
              <p className="text-center">{log.userName}</p>
            </div>
          );
        })}
      </div>
      <Button onClick={handleOpenModal} className="mb-3">
        Create log
      </Button>
      {showModal && (
        <CreateLogModal
          tasks={tasks}
          onClose={handleCloseModal}
          projectId={projectId}
        />
      )}
    </div>
  );
}

export default ActivityLogs;

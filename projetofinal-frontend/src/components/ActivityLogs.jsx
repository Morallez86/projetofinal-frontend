import React from "react";
import { Button } from "flowbite-react";
import CreateLogModal from "./CreateLogModal";
import { useState } from "react";

function ActivityLogs({tasks}) {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  return (
    <div className="flex flex-col items-center space-y-4 rounded-md bg-white">
      <h1 className="text-4xl font-bold underline mb-4">Activity Log</h1>
      <div className="overflow-auto space-y-4 h-[30rem]">
        <div className="w-72 h-24 bg-blue-300 rounded-md"></div>
        <div className="w-72 h-24 bg-orange-400 rounded-md"></div>
        <div className="w-72 h-24 bg-red-400 rounded-md"></div>
        <div className="w-72 h-24 bg-yellow-300 rounded-md"></div>
        <div className="w-72 h-24 bg-orange-400 rounded-md"></div>
      </div>
      <Button onClick={handleOpenModal} className="mb-3">
        Create log
      </Button>
      {showModal && <CreateLogModal  tasks= {tasks} onClose={handleCloseModal} />}
    </div>
  );
}

export default ActivityLogs;

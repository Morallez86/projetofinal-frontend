import React from "react";

function ActivityLogs() {
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
    </div>
  );
}

export default ActivityLogs;

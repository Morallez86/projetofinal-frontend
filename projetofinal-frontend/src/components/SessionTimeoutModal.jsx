import React from "react";

const SessionTimeoutModal = ({ show, onLogout }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-xl font-semibold mb-4">Session Timed Out</h2>
        <p className="mb-4">
          Your session has expired. You will be redirected to the login page.
        </p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onLogout}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;

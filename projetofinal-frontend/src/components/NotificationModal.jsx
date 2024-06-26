import React from "react";
import { TiTick, TiTimes } from "react-icons/ti";

const NotificationModal = ({ isOpen, closeModal, notification }) => {
  if (!notification) {
    return null;
  }

  const formatDateForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTimeForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedDate = formatDateForInput(notification.timestamp);
  const formattedTime = formatTimeForInput(notification.timestamp);

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "flex items-center justify-center" : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div
        className="modal-content bg-white opacity-95 border border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-gray-400  w-full max-w-md p-4 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Notification Details</h2>
        <div className="mb-2">
          <strong>Description:</strong> {notification.description}
        </div>
        <div className="mb-2">
          <strong>Timestamp:</strong> {formattedDate} {formattedTime}
        </div>
        <div className="mb-2">
          <strong>Type:</strong> {notification.type}
        </div>
        <div className="mb-2">
          <strong>Seen:</strong> {notification.seen ? "Yes" : "No"}
        </div>
        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;

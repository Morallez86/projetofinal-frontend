import React from "react";
import { useState } from "react";
import { TiTick, TiTimes } from "react-icons/ti";
import { Button, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";

const NotificationModal = ({ isOpen, closeModal, notification }) => {
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);
  const [successMessage, setSuccessMessage] = useState(false);
  console.log(notification);

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

  const handleApprove = async () => {
    try {
      const response = await fetch(`${apiUrl}/notifications/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: notification.id,
          projectId: notification.projectId,
          receiverId: notification.receiverId,
          approval: true,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          closeModal();
          setSuccessMessage(true);
        }, 3000);
      } else {
        console.error("Failed to approve notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`${apiUrl}/notifications/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: notification.id,
          projectId: notification.projectId,
          receiverId: notification.receiverId,
          approval: false,
        }),
      });

      if (response.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          closeModal();
          setSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Failed to reject notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "flex items-center justify-center" : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div
        className="modal-content bg-white opacity-95 border border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-gray-400  w-full max-w-md p-6 rounded-lg shadow-lg"
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
        {successMessage === true && (
          <div className="mb-2 ml-4 flex items-center col-span-full">
            <Label
              htmlFor="success"
              value="A notification was sent"
              className="mb-2 text-green-700"
            />
          </div>
        )}
        {notification.type === "MANAGING" && !notification.seen && (
          <div className="flex mt-4">
            <div className="flex-grow flex space-x-2">
              <Button color="success" onClick={handleApprove}>
                <TiTick size={20} />
              </Button>
              <Button color="failure" onClick={handleReject}>
                <TiTimes size={20} />
              </Button>
            </div>
          </div>
        )}
        <div className="mt-4 ml-auto">
          <button
            onClick={closeModal}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

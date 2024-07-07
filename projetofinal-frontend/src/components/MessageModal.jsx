import React, { useState } from "react";
import useApiStore from "../Stores/ApiStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const MessageModal = ({
  isOpen,
  closeModal,
  message,
  authToken,
  selectedUser,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const apiUrl = useApiStore.getState().apiUrl;
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };
  const { t } = useTranslation();

  const handleReply = async () => {
    let sendMessageTo;

    if (message) {
      sendMessageTo =
        message.view === "sent" ? message.receiverId : message.senderId;
    } else if (selectedUser) {
      sendMessageTo = selectedUser.id;
    }

    try {
      const response = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: replyContent,
          receiverId: sendMessageTo,
        }),
      });
      if (response.status === 401) {
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";
        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Session timeout
          return; // Exit early if session timeout
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const savedMessage = await response.json();
      console.log("Reply sent successfully:", savedMessage);
      setReplyContent("");

      // Close the modal after replying
      closeModal();
    } catch (error) {
      console.error("Error replying to message:", error);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
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
        onClick={handleModalClick}
      >
        <h2 className="text-xl font-bold mb-4">
          {message ? t("MessageDeatils") : t("SendMessage")}
        </h2>

        {message && (
          <>
            <div className="mb-2">
              <strong>{t("From")}</strong> {message.senderUsername}
            </div>
            <div className="mb-2">
              <strong>{t("To")}</strong> {message.receiverUsername}
            </div>
            <div className="mb-2">
              <strong>{t("Content")}</strong> {message.content}
            </div>
            <div className="mb-2">
              <strong>{t("Seen")}</strong> {message.seen ? "Yes" : "No"}
            </div>
          </>
        )}

        {selectedUser && (
          <>
            <div className="mb-2">
              <strong>{t("To")}</strong> {selectedUser.username}
            </div>
          </>
        )}

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={t("Typeyourmessagehere")}
          rows={4}
          className="w-full border rounded-md p-2 mb-2"
        />
        <button
          onClick={handleReply}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {t("Send")}
        </button>

        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md ml-2 hover:bg-gray-400"
        >
          {t("Close")}
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

import React, { useState } from "react";
import useApiStore from "../Stores/ApiStore";

const MessageModal = ({ isOpen, closeModal, message, authToken }) => {
  const [replyContent, setReplyContent] = useState("");
  const apiUrl = useApiStore.getState().apiUrl;


  const handleReply = async () => {
    try {
      const response = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: replyContent,
          receiverId: message.senderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const savedMessage = await response.json();
      console.log("Reply sent successfully:", savedMessage);

      // Close the modal after replying
      closeModal();
    } catch (error) {
      console.error("Error replying to message:", error);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "flex items-center justify-center" : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

      <div
        className="modal-content bg-white opacity-90 w-full max-w-md p-4 rounded-lg shadow-lg"
        onClick={handleModalClick}
      >
        <h2 className="text-xl font-bold mb-4">Message Details</h2>

        <div className="mb-2">
          <strong>From:</strong> {message.senderUsername}
        </div>
        <div className="mb-2">
          <strong>To:</strong> {message.receiverUsername}
        </div>
        <div className="mb-2">
          <strong>Content:</strong> {message.content}
        </div>
        <div className="mb-2">
          <strong>Seen:</strong> {message.seen ? "Yes" : "No"}
        </div>

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your reply here..."
          rows={4}
          className="w-full border rounded-md p-2 mb-2"
        />
        <button
          onClick={handleReply}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Reply
        </button>

        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md ml-2 hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

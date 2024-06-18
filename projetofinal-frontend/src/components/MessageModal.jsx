import React, { useState } from "react";

const MessageModal = ({ isOpen, closeModal, message }) => {
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    console.log(
      "Replying to message:",
      message.id,
      "with content:",
      replyContent
    );
    // Close the modal after replying
    closeModal();
  };

  const formatDateForInput = (dateArray) => {
    // Implement date formatting function if needed
  };

  const formatTimeForInput = (dateArray) => {
    // Implement time formatting function if needed
  };

  return (
    <div
      className={`${
        isOpen
          ? "fixed inset-0 z-50 flex items-center justify-center"
          : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

      <div className="modal-content bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Message Details</h2>

        <div className="mb-2">
          <strong>From:</strong> {message.senderUsername}
        </div>
        <div className="mb-2">
          <strong>To:</strong> {message.receiverUsername}
        </div>
        <div className="mb-2">
          <strong>Timestamp:</strong> {formatDateForInput(message.timestamp)}{" "}
          {formatTimeForInput(message.timestamp)}
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

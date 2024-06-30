import React, { useState } from "react";
import useApiStore from "../Stores/ApiStore";
import { IoMdSearch } from "react-icons/io";

const NewMessageModal = ({ isOpen, closeModal, authToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const apiUrl = useApiStore.getState().apiUrl;

  // Function to fetch users based on searchTerm
  const fetchUsers = async () => {
    if (!searchTerm) return;
    try {
      const response = await fetch(
        `${apiUrl}/users?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser) {
      alert("Please select a user to send the message to.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: messageContent,
          receiverId: selectedUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();
      console.log("Message sent successfully:", savedMessage);
      setMessageContent("");
      // Close the modal after sending
      closeModal();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleSearch = () => {
    // Trigger user search
    setUsers([]); // Clear previous search results
    fetchUsers();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setUsers([]); // Clear search results after user selection
    setSearchTerm(user.username); // Clear search term
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

      <div
        className="modal-content bg-white opacity-95 border border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-gray-400  w-full max-w-md p-6 rounded-lg shadow-lg"
        onClick={handleModalClick}
      >
        <h2 className="text-xl font-bold mb-4">New Message</h2>

        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search for a user"
            className="w-full border rounded-md p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 flex items-center justify-center bg-blue-500 text-white rounded-md px-3"
          >
            <IoMdSearch size={20} />
          </button>

          {users.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 border border-gray-300 bg-white rounded-md shadow-md max-h-40 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`p-2 cursor-pointer ${
                    selectedUser && selectedUser.id === user.id
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() => handleUserSelection(user)}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="w-full border rounded-md p-2 mb-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send Message
        </button>

        <button
          onClick={closeModal}
          className="bg-gray-700 ml-4 text-white px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NewMessageModal;

import React, { useState } from "react";
import useApiStore from "../Stores/ApiStore";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewMessageModal = ({ isOpen, closeModal, authToken }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado do input de pesquisa
  const [users, setUsers] = useState([]);  // Estado dos utilizadores
  const [selectedUser, setSelectedUser] = useState(null); // Estado do utilizador selecionado
  const [messageContent, setMessageContent] = useState(""); // Estado do conteúdo da mensagem
  const apiUrl = useApiStore.getState().apiUrl; // URL da API
  const { t } = useTranslation(); // Função de tradução
  const navigate = useNavigate();
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  
  const fetchUsers = async () => { // Função para obter os utilizadores 
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
      if (response.status === 401) {
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";
        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return;
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) { // Verificar se a resposta é bem-sucedida
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSendMessage = async () => { // Função para enviar a mensagem
    if (!selectedUser) {
      alert("Please select a user to send the message to.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/messages`, { // Enviar a mensagem
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
      if (response.status === 401) { // Verificar se o token é inválido
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";
        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();
      console.log("Message sent successfully:", savedMessage);
      setMessageContent("");
      
      closeModal();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleModalClick = (e) => { // Função para lidar com o clique no modal
    e.stopPropagation();
  };

  const handleSearch = () => { // Função para pesquisar
    
    setUsers([]);
    fetchUsers();
  };

  const handleKeyPress = (e) => { // Função para lidar com a tecla pressionada
    if (e.key === "Enter") { // Verificar se a tecla pressionada é Enter
      handleSearch();
    }
  };

  const handleUserSelection = (user) => { // Função para selecionar o utilizador
    setSelectedUser(user);
    setUsers([]); 
    setSearchTerm(user.username);
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
        <h2 className="text-xl font-bold mb-4"> {t("NewMessage")}</h2>

        <div className="relative mb-2">
          <input
            type="text"
            placeholder={t("SearchUser")}
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
          placeholder={t("MessageContent")}
          rows={4}
          className="w-full border rounded-md p-2 mb-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {t("Send")}
        </button>

        <button
          onClick={closeModal}
          className="bg-gray-700 ml-4 text-white px-4 py-2 rounded-md hover:bg-gray-400"
        >
          {t("Close")}
        </button>
      </div>
    </div>
  );
};

export default NewMessageModal;

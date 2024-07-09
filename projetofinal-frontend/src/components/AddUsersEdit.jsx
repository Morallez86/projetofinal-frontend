import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import basePhoto from "../Assets/092.png";
import { jwtDecode } from "jwt-decode";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";

function AddUsersEdit({ openPopUpUsers, closePopUpUsers, projectInfo }) {
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const navigate = useNavigate();
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Redirecionar para a página inicial
  };
  let currentUserId; // ID do utilizador atual

  if (token) {
    const decodedToken = jwtDecode(token); // Decodificar o token
    currentUserId = decodedToken.id; // Obter o ID do utilizador
  }

  const [users, setUsers] = useState([]); // Utilizadores
  const [userImages, setUserImages] = useState({}); // Imagens dos utilizadores
  const [inputValue, setInputValue] = useState(""); // Valor do input
  const [error, setError] = useState(""); // Erro
  const [selectedUser, setSelectedUser] = useState(null); // Utilizador selecionado
  const [showConfirmation, setShowConfirmation] = useState(false); // Mostrar confirmação

  const handleSearch = async () => { // Função para pesquisar utilizadores
    if (inputValue.length >= 3) { // Se o valor do input for maior ou igual a 3
      try {
        const response = await fetch(
          `${apiUrl}/users/search?query=${inputValue}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) { // Se a resposta for 200
          const data = await response.json();
          setUsers(data); // Definir os utilizadores
          fetchUserImages(data); // Obter as imagens dos utilizadores
        } else if (response.status === 404) { // Se a resposta for 404
          setUsers([]); // Definir os utilizadores como vazio
          setUserImages({}); // Definir as imagens dos utilizadores como vazio
        } else if (response.status === 401) { // Se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Timeout da sessão
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setUsers([]);
      setUserImages({});
    }
  };

  const fetchUserImages = async (users) => { // Função para obter as imagens dos utilizadores
    const userIds = users.map((user) => user.id); // Mapear os IDs dos utilizadores
    try {
      const response = await fetch(`${apiUrl}/users/images`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userIds),
      });

      if (response.ok) { // Se a resposta for 200
        const imagesData = await response.json();
        const imagesMap = {};
        imagesData.forEach((img) => {
          imagesMap[img.id] = img;
        });
        setUserImages(imagesMap);
      } else if (response.status === 401) { // Se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error fetching user images");
      }
    } catch (error) {
      console.error("Error fetching user images:", error);
    }
  };

  const handleInputChange = (event) => { // Função para lidar com a mudança do input
    setInputValue(event.target.value);
  };

  const handleAddUserClick = (user) => { // Função para lidar com o clique para adicionar utilizador
    setSelectedUser(user); // Definir o utilizador selecionado
    setShowConfirmation(true); // Mostrar a confirmação
  };

  const handleAddUser = async () => {
    const user = selectedUser;
    // Verifica se o número máximo de users na equipa foi atingido
    const activeUsersCount = projectInfo.userProjectDtos.filter(
      (projectUser) => projectUser.status === "active"
    ).length;

    if (activeUsersCount >= projectInfo.maxUsers) {
      setError(`Cannot add more than ${projectInfo.maxUsers} users`);
      return;
    }

    if (user.id === currentUserId) {
      setError("You cannot add yourself to the project team");
      return;
    }

    // Verifica se o utilizador já está na equipa
    if (
      projectInfo.userProjectDtos.some(
        (projectUser) =>
          projectUser.userId === user.id && projectUser.status === "active"
      )
    ) {
      setError("This user is already in the project team");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/notifications`, { // Adicionar notificação
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: user.id,
          type: "400",
          projectId: projectInfo.id,
        }),
      });

      if (response.ok) { // Se a resposta for 200
        closePopUpUsers();
        setInputValue("");
        setError("");
        setUsers([]);
        setUserImages({});
        setShowConfirmation(false);
      } else if (response.status === 401) { // Se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error adding user to project");
        setError("Error adding user to project");
      }
    } catch (error) {
      console.error("Error adding user to project:", error);
      setError("Error adding user to project");
    }
  };

  return (
    <>
      <Modal
        show={openPopUpUsers}
        size="xl"
        onClose={() => {
          closePopUpUsers();
          setUsers([]);
          setError("");
          setInputValue("");
          setUserImages({});
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Add User
            </h3>
            <div className="space-y-3">
              <h4>Search for a user by typing at least 3 letters</h4>
              <div className="flex items-center space-x-4">
                <TextInput
                  id="search"
                  type="text"
                  placeholder="Search for users"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
              <div className="mt-4 w-full">
                {users.length > 0 ? (
                  <ul className="space-y-2">
                    {users.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAddUserClick(user)}
                      >
                        <div className="flex items-center">
                          {userImages[user.id] ? (
                            <img
                              src={`data:${userImages[user.id].type};base64,${
                                userImages[user.id].image
                              }`}
                              alt={`${user.username}'s profile`}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            <img
                              src={basePhoto}
                              alt="Placeholder"
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          )}
                          <span>{user.username}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No users found</p>
                )}
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ConfirmationModal
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleAddUser}
        message={`Are you sure you want to add ${selectedUser?.username} to the project?`}
      />
    </>
  );
}

export default AddUsersEdit;

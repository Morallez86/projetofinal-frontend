import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import useApiStore from "../Stores/ApiStore";
import basePhoto from "../Assets/defaultAvatar.jpg";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AddUsers({ openPopUpUsers, closePopUpUsers, projectInfo }) {
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const projectUsers = useProjectStore((state) => state.projectUsers); // Obter os utilizadores do projeto
  const setProjectUsers = useProjectStore((state) => state.setProjectUsers); // Definir os utilizadores do projeto
  let currentUserId; // ID do utilizador atual
  if (token) {
    const decodedToken = jwtDecode(token); // Decodificar o token
    currentUserId = decodedToken.id; // Obter o ID do utilizador
  }

  const [users, setUsers] = useState([]); // Utilizadores
  const [userImages, setUserImages] = useState({}); // Imagens dos utilizadores
  const [inputValue, setInputValue] = useState(""); // Valor do input
  const [error, setError] = useState(""); // Erro
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Redirecionar para a página inicial
  };
  const { t } = useTranslation(); // Função de tradução

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
          setUsers(data);
          
          fetchUserImages(data); // Obter as imagens dos utilizadores
        } else if (response.status === 401) { // Se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Timeout da sessão
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 404) { // Se a resposta for 404
          console.log("Users not found");
          setUsers([]); // Definir os utilizadores como vazio
          setUserImages({}); // Definir as imagens dos utilizadores como vazio
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setUsers([]); // Definir os utilizadores como vazio
      setUserImages({}); // Definir as imagens dos utilizadores como vazio
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

      if (response.ok) {
        const imagesData = await response.json();
        const imagesMap = {};
        imagesData.forEach((img) => { // Mapear as imagens
          imagesMap[img.id] = img; // Adicionar a imagem ao mapa
        });
        setUserImages(imagesMap); // Definir as imagens dos utilizadores
      } else if (response.status === 401) {  // Se a resposta for 401
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

  const handleAddUser = (user) => { // Função para adicionar um utilizador
    if (projectUsers.length >= projectInfo.maxUsers - 1) {
      setError(`Cannot add more than ${projectInfo.maxUsers - 1} users`);
      return;
    }
    

    if (user.id === currentUserId) { // Se o ID do utilizador for igual ao ID do utilizador atual
      setError("You cannot add yourself to the project team");
      return;
    }

    if (projectUsers.some((projectUser) => projectUser.userId === user.id)) { // Se o utilizador já estiver no projeto
      setError("This user is already in the project team");
      return;
    }

    const userData = { userId: user.id, username: user.username };

   
    setProjectUsers([...projectUsers, userData]); // Adicionar o utilizador ao projeto
 
    // Limpar os valores
    setInputValue("");
    setError("");
    setUsers([]);
    setUserImages({});
    closePopUpUsers();
  };

  return (
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
            {t("addUsers")}
          </h3>
          <div className="space-y-3">
            <h4>{t("SearchForAuserByTypingAtLeast3Letters")}</h4>
            <div className="flex items-center space-x-4">
              <TextInput
                id="search"
                type="text"
                placeholder={t("SearchForAUser")}
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button onClick={handleSearch}>{t("Search")}</Button>
            </div>
            <div className="mt-4 w-full">
              {users.length > 0 ? (
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAddUser(user)}
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
                <p className="text-gray-500">{t("NoUsersFound")}</p>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddUsers;

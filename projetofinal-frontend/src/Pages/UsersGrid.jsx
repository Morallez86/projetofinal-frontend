import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Avatar, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import useSkillStore from "../Stores/SkillStore";
import useInterestStore from "../Stores/InterestStore";
import basePhoto from "../Assets/092.png";
import MessageModal from "../Components/MessageModal";
import "../index.css";
import { useTranslation } from "react-i18next";

function UsersGrid() {
  const apiUrl = useApiStore((state) => state.apiUrl); // apiUrl
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); // utilizadores
  const [userImages, setUserImages] = useState({}); // imagens dos utilizadores
  const [searchTerm, setSearchTerm] = useState(""); // termo de pesquisa 
  const [selectedWorkplace, setSelectedWorkplace] = useState(""); // local de trabalho selecionado
  const [selectedSkills, setSelectedSkills] = useState(""); // skills selecionadas
  const [selectedInterests, setSelectedInterests] = useState(""); // interesses selecionados
  const [isModalOpen, setIsModalOpen] = useState(false); // modal aberto
  const [selectedUser, setSelectedUser] = useState(null); // utilizador selecionado
  const workplaces = useWorkplaceStore((state) => state.workplaces); // locais de trabalho
  const skills = useSkillStore((state) => state.skills); // skills
  const interests = useInterestStore((state) => state.interests); // interesses
  const { token } = useUserStore(); // token


  const { t } = useTranslation(); // tradução

  const fetchUserImages = useCallback( // função para buscar as imagens dos utilizadores
    async (users) => { 
      const userIds = users.map((user) => user.id);
      try {
        const response = await fetch(`${apiUrl}/users/images`, { // fetch das imagens dos utilizadores
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userIds),
        });

        if (response.ok) { // se a resposta for ok
          const imagesData = await response.json();
          const imagesMap = {};
          imagesData.forEach((img) => { // mapear as imagens
            imagesMap[img.id] = img;
          });
          setUserImages(imagesMap); // set das imagens
        } else {
          console.error("Error fetching user images");
        }
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    },
    [apiUrl, token] // dependências
  );

  const fetchUsers = useCallback( // função para buscar os utilizadores
    async (searchTerm = "", filters = {}) => {  // termo de pesquisa e filtros
      let url = `${apiUrl}/users`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("searchTerm", searchTerm); // adicionar termo de pesquisa
      }
      if (filters.workplace) {
        params.append("workplace", filters.workplace); // adicionar local de trabalho
      }
      if (filters.skills) {
        params.append("skills", filters.skills); // adicionar skills
      }
      if (filters.interests) {
        params.append("interests", filters.interests); // adicionar interesses
      }

      if (params.toString()) {
        url += `?${params.toString()}`; // url com os parâmetros
      }

      try {
        const response = await fetch(url, { // fetch dos utilizadores
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok) { // se a resposta for ok
          if (data.length > 0) { // se houver utilizadores
            setUsers(data); // set dos utilizadores
            await fetchUserImages(data);
          } else {
            setUsers([]);
            console.warn("No users found.");
          }
        } else if (response.status === 401) { // se o status for 401
          const errorMessage = data.message || "Unauthorized";
          
          // Differentiate based on error message
          if (errorMessage === "Invalid token") { // token inválido
            handleSessionTimeout(); // timeout da sessão
          }
        } else {
          console.error("Error fetching users");
          const data = await response.json();
          
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [apiUrl, token, fetchUserImages] // dependências
  );

 
  useEffect(() => { // useEffect para buscar os utilizadores
    const fetchInitialUsers = async () => { 
      await fetchUsers();
    };
    fetchInitialUsers();
  }, [fetchUsers]); // dependências

  const handleSearch = () => { // função para pesquisar
    fetchUsers(searchTerm, {
      workplace: selectedWorkplace,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  const handleWorkplaceChange = (value) => setSelectedWorkplace(value); // função para mudar o local de trabalho
  const handleSkillsChange = (value) => setSelectedSkills(value); // função para mudar as skills
  const handleInterestsChange = (value) => setSelectedInterests(value); // função para mudar os interesses

  const openMessageModal = (user) => { // função para abrir o modal de mensagem
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => { // função para fechar o modal de mensagem
    setSelectedUser(null); 
    setIsModalOpen(false);
  };

  const handleSessionTimeout = () => { // função para timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // navegar para a página inicial
  };

  return (
    <div className="flex flex-col min-h-screen">
  <div className="p-4 sm:p-8">
    <div className="flex flex-col sm:flex-row items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <TextInput
        type="text"
        placeholder={t("SearchByUsername")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/3"
      />
      <select
        id="workplace"
        value={selectedWorkplace}
        onChange={(e) => handleWorkplaceChange(e.target.value)}
        className="w-full sm:w-auto"
      >
        <option value="">{t("SelectWorkplace")}</option>
        {workplaces.map((workplace) => (
          <option key={workplace.id} value={workplace.name}>
            {workplace.name}
          </option>
        ))}
      </select>
      <select
        id="skills"
        value={selectedSkills}
        onChange={(e) => handleSkillsChange(e.target.value)}
        className="w-full sm:w-auto"
      >
        <option value="">{t("SelectSkills")}</option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </select>
      <select
        id="interests"
        value={selectedInterests}
        onChange={(e) => handleInterestsChange(e.target.value)}
        className="w-full sm:w-auto"
      >
        <option value="">{t("SelectInterests")}</option>
        {interests.map((interest) => (
          <option key={interest.id} value={interest.name}>
            {interest.name}
          </option>
        ))}
      </select>
      <Button onClick={handleSearch} className="w-full sm:w-auto">{t("Search")}</Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4 flex flex-col items-center">
          <Avatar
                img={
                  userImages[user.id]?.image
                    ? `data:${userImages[user.id].type};base64,${
                        userImages[user.id].image
                      }`
                    : basePhoto
                }
                rounded={true}
                size="xl"
              />
              <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-4 flex space-x-2">
                {user.visibility ? (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    {t("Profile")}
                  </Button>
                ) : (
                  <Button size="sm" disabled>
                    {t("Profile")}
                  </Button>
                )}
                <button
                  className="group relative flex items-stretch justify-center p-0.5 text-center font-medium border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg"
                  onClick={() => openMessageModal(user)}
                >
                  <span className="flex items-stretch transition-all duration-200 rounded-md px-3 py-1.5 text-sm">
                    {t("Message")}
                  </span>
                </button>
              </div>
        </Card>
      ))}
    </div>
  </div>
  <MessageModal
    isOpen={isModalOpen}
    closeModal={closeMessageModal}
    authToken={token}
    selectedUser={selectedUser}
  />
</div>
  );
}

export default UsersGrid;

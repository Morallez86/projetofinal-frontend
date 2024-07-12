import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import ProjectDetailsCard from "../Components/ProjectDetailsCard";
import TaskCard from "../Components/TaskCard";
import ActivityLogs from "../Components/ActivityLogs";
import { SiGooglemessages } from "react-icons/si";
import GroupProjectChat from "../Components/GroupProjectChat";
import { motion } from "framer-motion";
import WebSocketProjChat from "../WebSocketProjChat";
import AddUsersEdit from "../Components/AddUsersEdit";
import AddSkills from "../Components/AddSkills";
import RemoveSkills from "../Components/RemoveSkills";
import AddInterests from "../Components/AddInterests";
import RemoveInterests from "../Components/RemoveInterests";
import AddComponents from "../Components/AddComponents";
import RemoveComponents from "../Components/RemoveComponents";
import AddResources from "../Components/AddResources";
import RemoveResources from "../Components/RemoveResources";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";



function ProjectDetails() {
  const { projectId } = useParams(); // projectId
  const { token } = useUserStore(); // token
  const navigate = useNavigate(); 
  const { t } = useTranslation(); // Função de tradução
  const [project, setProject] = useState(null); // projeto
  const [tasks, setTasks] = useState([]); // tarefas
  const [userImages, setUserImages] = useState({}); // imagens do usuário
  const [loading, setLoading] = useState(true); // loading
  const apiUrl = useApiStore((state) => state.apiUrl); // apiUrl
  const [isChatOpen, setIsChatOpen] = useState(false); // chat aberto
  const [team, setTeam] = useState([]); // equipa
  const [unreadMessages, setUnreadMessages] = useState(0); // mensagens não lidas
  const projectTimestamps = useUserStore((state) => state.projectTimestamps); // timestamps dos projetos
  const setProjectTimestamp = useUserStore(
    (state) => state.setProjectTimestamp // set do timestamp do projeto
  );
  const isChatOpenRef = useRef(isChatOpen); // chat aberto ref
  const [messagesAlone, setMessagesAlone] = useState([]); //array de mensagens temporárioas 
  const [allMsgs, setAllMsgs] = useState([]); // todas as mensagens
  const [reopenSocket, setReopenSocket] = useState(true); // reabrir o socket
  const [statePopUpUsers, setStatePopUpUsers] = useState(false); // popup de utilizadores
  const [statePopUpSkills, setStatePopUpSkills] = useState(false);  // popup de skills
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false); // popup de remover skills
  const [statePopUpInterests, setStatePopUpInterests] = useState(false); // popup de interesses
  const [statePopUpInterestRemove, setStatePopUpInterestRemove] = 
    useState(false); // popup de remover interesses
  const [statePopUpComponent, setStatePopUpComponent] = useState(false); // popup de componentes
  const [statePopUpComponentsRemove, setStatePopUpComponentsRemove] =
    useState(false); // popup de remover componentes
  const [statePopUpResources, setStatePopUpResources] = useState(false);
  const [statePopUpResourcesRemove, setStatePopUpResourcesRemove] =
    useState(false); // popup de remover recursos

  const openAddUsersModal = () => setStatePopUpUsers(true); // abrir popup de utilizadores
  const closeAddUsersModal = () => setStatePopUpUsers(false); // fechar popup de utilizadores
  const openAddSkillsModal = () => setStatePopUpSkills(true); // abrir popup de skills
  const closeAddSkillsModal = () => { // fechar popup de skills
    setStatePopUpSkills(false);
    fetchProjectDetails(); 
  };
  const openAddSkillsRemoveModal = () => setStatePopUpSkillsRemove(true); // abrir popup de remover skills
  const closeAddSkillsRemoveModal = () => { // fechar popup de remover skills
    setStatePopUpSkillsRemove(false);
    fetchProjectDetails();
  };
  const openAddInterestsModal = () => setStatePopUpInterests(true); // abrir popup de interesses
  const closeAddInterestsModal = () => { // fechar popup de interesses
    setStatePopUpInterests(false);
    fetchProjectDetails();
  };
  const openAddInterestRemoveModal = () => setStatePopUpInterestRemove(true); // abrir popup de remover interesses
  const closeAddInterestRemoveModal = () => { // fechar popup de remover interesses
    setStatePopUpInterestRemove(false);
    fetchProjectDetails();
  };

  const openAddComponentModal = () => setStatePopUpComponent(true); // abrir popup de componentes
  const closeAddComponentModal = () => { // fechar popup de componentes
    setStatePopUpComponent(false);
    fetchProjectDetails();
  };

  const openRemoveComponentsModal = () => setStatePopUpComponentsRemove(true); // abrir popup de remover componentes
  const closeRemoveComponentsModal = () => { // fechar popup de remover componentes
    setStatePopUpComponentsRemove(false);
    fetchProjectDetails();
  };

  const openAddResourcesModal = () => setStatePopUpResources(true); // abrir popup de recursos

  const closeAddResourcesModal = () => { // fechar popup de recursos
    setStatePopUpResources(false);
    fetchProjectDetails();
  };

  const openRemoveResourcesModal = () => setStatePopUpResourcesRemove(true); // abrir popup de remover recursos

  const closeRemoveResourcesModal = () => { // fechar popup de remover recursos
    setStatePopUpResourcesRemove(false);
    fetchProjectDetails();
  };

  const onMessageChat = (message) => { // função para receber mensagens
    setMessagesAlone((prevMessages) => [
      ...prevMessages,
      {
        content: message.content,
        senderUsername: message.senderUsername,
        senderId: message.senderId,
        senderOnline: message.senderOnline,
        projectId: message.projectId,
        timestamp: message.timestamp,
      },
    ]);

    if (!isChatOpen) { // se o chat não estiver aberto
      setUnreadMessages((prevCount) => prevCount + 1); // incrementar o contador de mensagens não lidas
    }
  };

  WebSocketProjChat(projectId, token, onMessageChat, reopenSocket); // websocket

  useEffect(() => { // useEffect para atualizar o chat  
    isChatOpenRef.current = isChatOpen; // chat aberto ref
  }, [isChatOpen]); // dependências

  useEffect(() => { // useEffect para atualizar os detalhes do projeto
    
    return () => {
      if (isChatOpenRef.current && project && project.id != null) { // se o chat estiver aberto
        const now = new Date();
        const localTimestamp = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        ).toISOString();
        setProjectTimestamp(project.id, localTimestamp);
      }
    };
  }, [project, setProjectTimestamp]); // dependências

  const fetchProjectDetails = async () => { // função para buscar os detalhes do projeto
    setLoading(true); // loading
    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) { // se a resposta não for ok
        if (response.status === 401) { // status 401
          
          try {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Unauthorized";
            if (errorMessage === "Invalid token") {
              handleSessionTimeout();
            }
            console.error(`Error fetching project details: ${errorMessage}`);
          } catch (error) {
            console.error("Error parsing error response:", error);
          }
        } else {
          
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else { // se a resposta for ok
        
        const data = await response.json();
        
        setProject(data); // set do projeto
        setTasks(data.tasks || []); // set das tarefas
        setTeam(data.userProjectDtos || []); // set da equipa
        setMessagesAlone(data.chatMessage || []); // set das mensagens
        setAllMsgs(data.chatMessage || []); // set de todas as mensagens

        
        const userIds = data.userProjectDtos
          .map((up) => up.userId)
          .filter((value, index, self) => self.indexOf(value) === index); // ids dos utilizadores

        const imagesResponse = await fetch(`${apiUrl}/users/images`, { // fetch das imagens dos utilizadores
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userIds),
        });

        if (imagesResponse.ok) { // se a resposta for ok
          const imagesData = await imagesResponse.json();
          const imagesMap = {};
          imagesData.forEach((img) => { // mapear as imagens
            imagesMap[img.id] = img;
          });
          setUserImages(imagesMap); // set das imagens
        } else {
          console.error(
            "Error fetching user images:",
            imagesResponse.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // useEffect para buscar os detalhes do projeto
    fetchProjectDetails(); // fetch dos detalhes do projeto
  }, [projectId, apiUrl, token]); // dependências

  useEffect(() => { // useEffect para atualizar as mensagens não lidas
    getUnreadMessages(); // função para obter as mensagens não lidas
  }, [projectTimestamps, allMsgs]); // dependências

  const getUnreadMessages = () => { // função para obter as mensagens não lidas
    const projectTimestamp = new Date(projectTimestamps[projectId]); // timestamp do projeto
    let count = 0;

    messagesAlone.forEach((message) => { // para cada mensagem
      const messageDate = new Date(
        Date.UTC(
          message.timestamp[0],
          message.timestamp[1] - 1,
          message.timestamp[2],
          message.timestamp[3],
          message.timestamp[4],
          message.timestamp[5],
          message.timestamp[6] / 1000000
        )
      );

      if (messageDate > projectTimestamp) { // se a mensagem for mais recente que o timestamp do projeto
        count++;
      }
    });

    setUnreadMessages(count); // set das mensagens não lidas
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  const handleSessionTimeout = () => { // função para timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // navegar para a página inicial
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap justify-center">
        <div className="w-full md:w-1/3 p-4">
          <div className="flex flex-col overflow-y-auto bg-transparent h-[45rem]">
            <ProjectDetailsCard
              project={project}
              setProject={setProject}
              userImages={userImages}
              openPopUpUsers={openAddUsersModal}
              openPopUpSkills={openAddSkillsModal}
              openPopUpSkillsRemove={openAddSkillsRemoveModal}
              openPopUpInterests={openAddInterestsModal}
              openPopUpInterestRemove={openAddInterestRemoveModal}
              openPopUpComponent={openAddComponentModal}
              openPopUpComponentsRemove={openRemoveComponentsModal}
              openPopUpResources={openAddResourcesModal}
              openPopUpResourcesRemove={openRemoveResourcesModal}
              fetchProjectDetails = {fetchProjectDetails}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
          <div className="flex flex-col overflow-y-auto bg-transparent h-[45rem]">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userImages={userImages}
                  projectUsers={project.userProjectDtos}
                  totalTasks={tasks}
                  setTotalTasks={setTasks}
                  fetchProjectDetails = {fetchProjectDetails}
                />
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
          <ActivityLogs
            tasks={tasks}
            projectId={project.id}
            logs={project.historyrecords}
          />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "25px",
          zIndex: "1000",
        }}
      >
        <button
          onClick={() => {
            const currentlyOpen = isChatOpen;
            setIsChatOpen(!isChatOpen);
            if (currentlyOpen) {
              const now = new Date();
              const localTimestamp = new Date(
                now.getTime() - now.getTimezoneOffset() * 60000
              ).toISOString();
              setProjectTimestamp(project.id, localTimestamp);
            }
          }}
        >
          <SiGooglemessages size={60} />
          {unreadMessages > 0 && (
            <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadMessages}
            </div>
          )}
        </button>
      </div>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GroupProjectChat
            photos={userImages}
            users={team}
            messages={messagesAlone}
            changeParent={setMessagesAlone}
          />
        </motion.div>
      )}
      <AddUsersEdit
        openPopUpUsers={statePopUpUsers}
        closePopUpUsers={closeAddUsersModal}
        projectInfo={project}
      />
      <AddSkills
        openPopUpSkills={statePopUpSkills}
        closePopUpSkills={closeAddSkillsModal}
        projectInfo={project}
        context={"editProject"}
      />
      <RemoveSkills
        openPopUpSkillsRemove={statePopUpSkillsRemove}
        closePopUpSkillsRemove={closeAddSkillsRemoveModal}
        projectInfo={project}
        context={"editProject"}
      />
      <AddInterests
        openPopUpInterests={statePopUpInterests}
        closePopUpInterests={closeAddInterestsModal}
        projectInfo={project}
        context={"editProject"}
      />
      <RemoveInterests
        openPopUpInterestRemove={statePopUpInterestRemove}
        closePopUpInterestRemove={closeAddInterestRemoveModal}
        projectInfo={project}
        context={"editProject"}
      />
      <AddComponents
        openPopUpComponent={statePopUpComponent}
        closePopUpComponent={closeAddComponentModal}
        projectInfo={project}
        context={"editProject"}
      />
      <RemoveComponents
        openPopUpComponentsRemove={statePopUpComponentsRemove}
        closePopUpComponentsRemove={closeRemoveComponentsModal}
        projectInfo={project}
        context={"editProject"}
      />
      <AddResources
        openPopUpResources={statePopUpResources}
        closePopUpResources={closeAddResourcesModal}
        projectInfo={project}
        context={"editProject"}
      />
      <RemoveResources
        openPopUpResourcesRemove={statePopUpResourcesRemove}
        closePopUpResourcesRemove={closeRemoveResourcesModal}
        projectInfo={project}
        context={"editProject"}
      />
    </div>
  );
}

export default ProjectDetails;

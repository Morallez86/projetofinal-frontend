import React, { useEffect } from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { PiProjectorScreenChartLight, PiUsersThreeBold } from "react-icons/pi";
import { Tabs } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { CiSettings, CiBoxList } from "react-icons/ci";
import { VscTools } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { Avatar } from "flowbite-react";
import { MdWavingHand, MdOutlineMessage } from "react-icons/md";
import { TbLogout2, TbLogin2 } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import useUserStore from "../Stores/UserStore";
import criticalLogo from "../Assets/CriticalLogo.jpg";
import useApiStore from "../Stores/ApiStore";
import { jwtDecode } from "jwt-decode";
import { ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import i18n from "../Language/i18n";
import { Dialog, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import BurgerMenu from './BurguerMenu'; 
import { motion } from "framer-motion";
import pincel from "../Assets/pincel.png";

function Layout({
  activeTab,
  activeSubTabProfile,
  activeSubProjects,
  activeSubComponents,
  unreadMessages,
  unreadNotifications,
  children,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const { token, setToken, profileImage, setProfileImage, clearProfileImage } =
    useUserStore(); // Obter o token, a imagem de perfil e as funções para definir o token e a imagem de perfil
  const projectTimestamps = useUserStore((state) => state.projectTimestamps); // Obter os timestamps dos projetos
  const [switch2, setSwitch2] = useState(false); // Estado do switch
  const languageApp = useUserStore((state) => state.language); // Obter a linguagem da aplicação
  const setLanguageApp = useUserStore((state) => state.setLanguage); // Função para definir a linguagem da aplicação
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  const handleLanguageToggle = () => { // Função para alternar a linguagem
    const newLanguage = languageApp === "en" ? "pt" : "en"; 
    setLanguageApp(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  

  let userId, username;
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decodificar o token
      userId = decodedToken.id; // Obter o ID do utilizador
      username = decodedToken.username; // Obter o nome de utilizador
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (token && userId) {
        try {
          const response = await fetch(`${apiUrl}/users/${userId}/image`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setProfileImage(imageObjectURL);
          } else if (response.status === 401) {
            const data = await response.json();
            const errorMessage = data.message || "Unauthorized";

            if (errorMessage === "Invalid token") {
              handleSessionTimeout(); // Lidar com o timeout da sessão
              return; 
            } else {
              console.error("Error updating seen status:", errorMessage);
            }
          } else {
            console.error("Failed to fetch profile image:", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage(); // Chamar a função fetchProfileImage
  }, [apiUrl, token, userId, setProfileImage]); // Dependências do useEffect

  const handleLogout = async () => { // Função para fazer logout
    console.log(token);
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectTimestamps }),
        });

        if (response.ok) { // Se o logout for bem-sucedido
          console.log(token);
          setToken(null);
          clearProfileImage();
          navigate("/");
        } else {
          console.log(token);
          setToken(null); // Limpar o token em caso de erro
          navigate("/");
        }
      } catch (error) {
        console.log(token);
        setToken(null); // Limpar o token em caso de erro
        navigate("/");
      }
    } else {
      navigate("/"); // Navegar para a página inicial
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="md:hidden p-4 flex justify-between items-center space-x-1">
  {token ? (
    <>
      <button onClick={() => setIsMenuOpen(true)}>
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="inline-flex justify-end items-center space-x-1">
        {/* Toggle de linguagem */}
        <ToggleSwitch
          checked={languageApp === 'pt'}
          label={languageApp === 'en' ? "EN" : "PT"} 
          onChange={handleLanguageToggle}
        />
        {/* Ícone de mensagens com contêiner relativo */}
        <div className="cursor-pointer relative">
          <MdOutlineMessage size={25} onClick={() => navigate("/messages")} />
          {unreadMessages > 0 && (
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {unreadMessages}
            </div>
          )}
        </div>
        {/* Ícone de notificações com contêiner relativo */}
        <div className="cursor-pointer relative">
          <IoIosNotificationsOutline size={25} onClick={() => navigate("/notifications")} />
          {unreadNotifications > 0 && (
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {unreadNotifications}
            </div>
          )}
        </div>
        {/* Foto do perfil e botão de logout */}
        <div className="flex items-center">
          <Avatar img={profileImage} alt="avatar" size="sm" rounded/> 
          <button
            className="ml-1 p-1 flex border border-gray-600 hover:bg-cyan-700 items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold" 
            onClick={handleLogout}
          >
            <TbLogout2 size={25} />
          </button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex justify-end items-center flex-1">
      {/* Toggle de linguagem */}
      <ToggleSwitch
        checked={languageApp === 'pt'}
        label={languageApp === 'en' ? "EN" : "PT"} 
        onChange={handleLanguageToggle}
        className="mr-2" // Adiciona margem à direita para separar do botão de login
      />
      <button
        className="p-2 flex border border-gray-600 hover:bg-cyan-700 hover:text-white items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold"
        onClick={() => navigate("/Login")}
      >
        <TbLogin2 size={35} />
      </button>
    </div>
  )}
</div>
    <Dialog open={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="relative z-50 md:hidden">
      <Transition.Child as="div" className="fixed top-0 left-0 w-3/4 h-full bg-white p-4 shadow-xl"
        enter="transition-transform ease-in-out duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full">
        
        <BurgerMenu />
      </Transition.Child>
    </Dialog>
    
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr] gap-4 p-4 px-8">
      <div className="flex flex-col items-start">
          <img
            src={criticalLogo}
            alt="Critical Logo"
            className="w-32 rounded border border-gray-600 h-auto"
          />
          {token && username && (
            <div className="flex items-center space-x-2 mt-4">
              <MdWavingHand size={20} />
              <h1 className="text-black font-bold">Hey {username}</h1>
            </div>
          )}
        </div>
        {token ? (
          <div className="flex flex-col items-center">
            <Tabs
              aria-label="Full width tabs"
              variant="fullWidth"
              defaultValue={activeTab}
              onActiveTabChange={(value) => {
                switch (value) {
                  case 0:
                    navigate("/myProjects");
                    break;
                  case 1:
                    navigate("/createNewProject");
                    break;
                  case 2:
                    navigate("/components");
                    break;
                  default:
                    break;
                }
              }}
            >
              <Tabs.Item
              active={activeTab === 0}
                value={0}
                title={
                  <motion.div
                  whileHover={{
                    x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                    transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                  }}
                  whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                  className={`cursor-pointer p-2 ${activeTab === 0 ? 'text-blue-500 custom-active-style' : 'text-gray-500 custom-inactive-style'}`}
                  style={{
                    position: 'relative',
                    display: 'flex', // Usa flexbox para alinhar ícone e texto
        alignItems: 'center', // Centraliza verticalmente o ícone e o texto
        justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                    color: 'black', // Define a cor do texto como preto
                    fontWeight: 'bold', // Torna o texto em negrito
                    backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                    backgroundPosition: 'center', // Centraliza a imagem de fundo
                    filter: activeTab === 0 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',                    
                  }}
                  
                >
                  
                  <ImProfile style={{ marginRight: '8px', fontSize: '19px' }} /> My Profile&nbsp;&nbsp;         </motion.div>
                }
            
              ></Tabs.Item>
              <Tabs.Item
                active={activeTab === 1}
                value={1}
                title={
                  <motion.div
                  whileHover={{
                    x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                    transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                  }}
                  whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                  className={`cursor-pointer p-2 ${activeTab === 0 ? 'text-blue-500 custom-active-style' : 'text-gray-500 custom-inactive-style'}`}
                  style={{
                    position: 'relative',
                    display: 'flex', // Usa flexbox para alinhar ícone e texto
        alignItems: 'center', // Centraliza verticalmente o ícone e o texto
        justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                    color: 'black', // Define a cor do texto como preto
                    fontWeight: 'bold', // Torna o texto em negrito
                    backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                    backgroundPosition: 'center', // Centraliza a imagem de fundo
                    filter: activeTab === 1 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',                  }}
                >
                 <AiOutlineFundProjectionScreen style={{ marginRight: '8px', fontSize: '19px' }} /> Projects/Users&nbsp;&nbsp;         </motion.div>
                }   
              ></Tabs.Item>
              <Tabs.Item
                active={activeTab === 2}
                value={2}
                title={
                  <motion.div
                  whileHover={{
                    x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                    transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                  }}
                  whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                  className={`cursor-pointer p-2 ${activeTab === 0 ? 'text-blue-500 custom-active-style' : 'text-gray-500 custom-inactive-style'}`}
                  style={{
                    position: 'relative',
                    display: 'flex', // Usa flexbox para alinhar ícone e texto
        alignItems: 'center', // Centraliza verticalmente o ícone e o texto
        justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                    color: 'black', // Define a cor do texto como preto
                    fontWeight: 'bold', // Torna o texto em negrito
                    backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                    backgroundPosition: 'center', // Centraliza a imagem de fundo
                    filter: activeTab === 2 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',                  }}
                >
                 <GrResources style={{ marginRight: '8px', fontSize: '19px' }} /> Components/Resources&nbsp;&nbsp;         </motion.div>
                }   
              ></Tabs.Item>
            </Tabs>

            <div className="flex flex-col items-center">
              {activeTab === 0 && (
                <div>
                  <Tabs
                    aria-label="Pills"
                    variant="pills"
                    className="w-full"
                    defaultValue={activeSubTabProfile}
                    onActiveTabChange={(value) => {
                      switch (value) {
                        case 0:
                          navigate("/myProjects");
                          break;
                        case 1:
                          navigate("/changePassword");
                          break;
                        case 2:
                          navigate("/aboutMe");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                   <Tabs.Item
  active={activeSubTabProfile === 0}
  value={0}
  title={
    <motion.div
      whileHover={{
        x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
        transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
      }}
      whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
      className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
      style={{
        position: 'relative',
        display: 'flex', // Usa flexbox para alinhar ícone e texto
        alignItems: 'center', // Centraliza verticalmente o ícone e o texto
        justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
        color: activeSubTabProfile === 0 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
        fontWeight: 'bold', // Torna o texto em negrito
        backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
        backgroundPosition: 'center', // Centraliza a imagem de fundo
        filter: activeSubTabProfile === 0 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
    >
      <PiProjectorScreenChartLight style={{ marginRight: '8px', fontSize: '19px' }} /> My Projects&nbsp;&nbsp;
    </motion.div>
  }
  
/>
                    <Tabs.Item
                      active={activeSubTabProfile === 1}
                      value={1}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubTabProfile === 1 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubTabProfile === 1 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <CiSettings style={{ marginRight: '8px', fontSize: '19px' }} /> Change Password&nbsp;&nbsp;
                        </motion.div>
                      }
                     
                    ></Tabs.Item>
                    <Tabs.Item
                      active={activeSubTabProfile === 2}
                      value={2}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubTabProfile === 2 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubTabProfile === 2 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <CgProfile style={{ marginRight: '8px', fontSize: '19px' }} /> About Me&nbsp;&nbsp;
                        </motion.div>
                      }
                    
                    ></Tabs.Item>
                  </Tabs>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <Tabs
                    aria-label="Pills"
                    variant="pills"
                    className="w-full"
                    onActiveTabChange={(value) => {
                      switch (value) {
                        case 0:
                          navigate("/createNewProject");
                          break;
                        case 1:
                          navigate("/projectsList");
                          break;
                        case 2:
                          navigate("/users");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Tabs.Item
                      active={activeSubProjects === 0}
                      value={0}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubProjects === 0 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubProjects === 0 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <IoCreateOutline style={{ marginRight: '8px', fontSize: '19px' }} />  Create New&nbsp;&nbsp;
                        </motion.div>
                      }
                     
                    ></Tabs.Item>
                    <Tabs.Item
                      active={activeSubProjects === 1}
                      value={1}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubProjects === 1 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubProjects === 1 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <CiBoxList style={{ marginRight: '8px', fontSize: '19px' }} />  Projects List&nbsp;&nbsp;
                        </motion.div>
                      }
                      
                    ></Tabs.Item>
                    <Tabs.Item
                      active={activeSubProjects === 2}
                      value={2}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubProjects === 2 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubProjects === 2 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <PiUsersThreeBold style={{ marginRight: '8px', fontSize: '19px' }} />  Users&nbsp;&nbsp;
                        </motion.div>
                      }
                     
                    ></Tabs.Item>
                  </Tabs>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <Tabs
                    aria-label="Pills"
                    variant="pills"
                    className="w-full "
                    onActiveTabChange={(value) => {
                      switch (value) {
                        case 0:
                          navigate("/components");
                          break;
                        case 1:
                          navigate("/resources");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Tabs.Item
                      active={activeSubComponents === 0}
                      value={0}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubComponents === 0 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubComponents === 0 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <VscTools style={{ marginRight: '8px', fontSize: '19px' }} />  Components&nbsp;&nbsp;
                        </motion.div>
                      }
                      
                    ></Tabs.Item>
                    <Tabs.Item
                      active={activeSubComponents === 1}
                      value={1}
                      title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 } // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          className={`cursor-pointer p-2 ${activeSubTabProfile === 0 ? 'custom-active-style' : 'custom-inactive-style'}`}
                          style={{
                            position: 'relative',
                            display: 'flex', // Usa flexbox para alinhar ícone e texto
                            alignItems: 'center', // Centraliza verticalmente o ícone e o texto
                            justifyContent: 'center', // Centraliza horizontalmente o ícone e o texto
                            color: activeSubComponents === 1 ? 'black' : 'inherit', // Mantém a cor do texto como preto quando ativo
                            fontWeight: 'bold', // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: 'center', // Centraliza a imagem de fundo
                            filter: activeSubComponents === 1 ? 'drop-shadow(2px 4px 6px black)' : 'contrast(0.5)',      }}
                        >
                          <GrResources style={{ marginRight: '8px', fontSize: '19px' }} />  Resources&nbsp;&nbsp;
                        </motion.div>
                      }
                     
                    ></Tabs.Item>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex justify-end items-start space-x-2">
          {token && (
            <>
              <div className="relative mt-3 mr-0 p-0">
                <ToggleSwitch
                  checked={languageApp === "pt"}
                  label={languageApp === "en" ? "Change to PT" : "Change to EN"}
                  onChange={() => {
                    handleLanguageToggle();
                    setSwitch2((prevState) => !prevState);
                  }}
                />
              </div>
              <div className="relative mt-3 cursor-pointer">
                <MdOutlineMessage
                  size={35}
                  onClick={() => navigate("/messages")}
                />
                {unreadMessages > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </div>
                )}
              </div>
              <div className="relative mt-3 cursor-pointer">
                <IoIosNotificationsOutline
                  size={35}
                  onClick={() => navigate("/notifications")}
                />
                {unreadNotifications > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </div>
                )}
              </div>
              <Avatar img={profileImage} alt="avatar" rounded />
              <button
                className="p-2 flex border mt-1 border-gray-600 hover:bg-cyan-700 items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold"
                onClick={handleLogout}
              >
                <TbLogout2 size={35} />
              </button>
            </>
          )}
          {!token && (
            <>
              <div className="relative mt-3 mr-0 p-0">
                <ToggleSwitch
                  checked={languageApp === "pt"}
                  label={languageApp === "en" ? "Change to PT" : "Change to EN"}
                  onChange={() => {
                    handleLanguageToggle();
                    setSwitch2((prevState) => !prevState);
                  }}
                />
              </div>
              <button
                className="p-2 flex border border-gray-600 hover:bg-cyan-700 hover:text-white items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold"
                onClick={() => navigate("/Login")}
              >
                <TbLogin2 size={35} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Layout;

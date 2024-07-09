import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore.js";
import useProjectStore from "../Stores/ProjectStore.js";
import useApiStore from "../Stores/ApiStore.js";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import { TbLockFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//O context é usado porque este componente é reutilizável 

function AddResources({ openPopUpResources, closePopUpResources, context }) {
  
  const { projectId } = useParams(); // Obter o id do projeto da URL
  const token = useUserStore((state) => state.token); // Obter o token do usuário
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter a URL da API
  const projectResources = useProjectStore((state) => state.projectResources); // Obter os recursos do projeto
  const setProjectResources = useProjectStore( // Definir os recursos do projeto
    (state) => state.setProjectResources
  );

  const [resources, setResources] = useState([]); // Definir os recursos
  const [selectedResource, setSelectedResource] = useState(null); // Definir o recurso selecionado
  const [inputValue, setInputValue] = useState(""); // Definir o valor de entrada
  const [animationPlayed, setAnimationPlayed] = useState(false); // Gerir a animação 
  const [showSuccessText, setShowSuccessText] = useState(false); // Definir o texto de sucesso exibido
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Gerir o tempo limite da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); 
  };

  const { t } = useTranslation(); // Traduzir o texto

  useEffect(() => { // Obter todos os recursos
    const getAllResources = async () => {
      try {
        const response = await fetch(`${apiUrl}/resources`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setResources(data); // Definir os recursos
          
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Sessão terminada
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 404) {
          console.log("Resources not found");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    getAllResources();
  }, [apiUrl, token]); // Dependências que fazem ativar o useEffect

  // Gerir a mudança de entrada
  const handleInputChange = (value) => {
    setInputValue(value);
  };

  // Mapear os recursos e definir as opções
  const options = resources.map((resource) => ({
    value: resource.name,
    label: resource.name,
    id: resource.id,
    isDisabled: projectResources.some(
      (projectResource) => projectResource.name === resource.name
    ),
  }));

  const defaultOptions = { // Opções padrão da animação
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSelectChange = (selectedOption) => { // Gerir a mudança de seleção
    setSelectedResource(selectedOption);
  };

  const handleSubmit = async () => { // Gerir o envio do formulário
    if (!selectedResource) return; // Se não houver recurso selecionado, sai

    const data = {
      name: selectedResource.value,
    };

    if (context === "editProject") {
      try {
        console.log(data);
        const response = await fetch(
          `${apiUrl}/projects/${projectId}/addResource`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              resource: data,
            }),
          }
        );
        if (response.status === 200) {
          setAnimationPlayed(true); // Ativar a animação
          setShowSuccessText(true); // Exibir o texto de sucesso
          setSelectedResource(null); // Limpar o recurso selecionado
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Sessão terminada
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 409) {
          console.error("Resource already exists in the project");
        } else if (response.status === 404) {
          console.error("Project not found");
        } else {
          console.error("Failed to add resource to project");
        }
      } catch (error) {
        console.error("Error adding resource to project:", error);
      }
    } else {
      const data = {
        id: selectedResource.id,
        name: selectedResource.value,
      };
      setProjectResources([...projectResources, data]);
      setAnimationPlayed(true); // Ativar a animação
      setShowSuccessText(true); // Exibir o texto de sucesso
      setSelectedResource(null); // Limpar o recurso selecionado
    }
  };

  return (
    <Modal
      show={openPopUpResources}
      size="xl"
      onClose={() => {
        closePopUpResources();
        setSelectedResource(null);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("AddResources")}
          </h3>
          <div className="space-y-3">
            <h4>{t("CreateANewResourceOrChooseOne")}</h4>
            <div className="flex items-start space-x-4 min-h-[25rem] relative">
              <div className="text center z-10">
                <CreatableSelect
                  options={options}
                  onChange={handleSelectChange}
                  onInputChange={handleInputChange}
                  isOptionDisabled={(option) =>
                    option.isDisabled || inputValue.length > 20
                  }
                  formatOptionLabel={(option) => ( // Formatar a etiqueta da opção, adicionando um ícone de bloqueio se o recurso estiver desativado
                    <div>
                      {option.label}
                      {option.isDisabled ? <TbLockFilled /> : null}
                    </div>
                  )}
                  placeholder={t("SelectResource")}
                  value={selectedResource}
                />
              </div>
              <div
                id="icon-element"
                className="pointer-events-none flex items-center justify-center h-full absolute"
                style={{
                  zIndex: 1,
                  left: 0,
                  right: 0,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div style={{ transform: "scale(3.5)" }}>
                  <Lottie
                    options={defaultOptions}
                    height={200}
                    width={200}
                    isStopped={!animationPlayed}
                    isPaused={!animationPlayed}
                    eventListeners={[
                      {
                        eventName: "complete",
                        callback: () => {
                          setAnimationPlayed(false);
                          setTimeout(() => setShowSuccessText(false), 500);
                        },
                      },
                    ]}
                  />
                </div>
                {showSuccessText && (
                  <div className="animate-pulse text-green-500 font-bold absolute bottom-0">
                    {t("ResourceAddedSuccessfully")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleSubmit} disabled={!selectedResource}>
                {t("AddResource")}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddResources;

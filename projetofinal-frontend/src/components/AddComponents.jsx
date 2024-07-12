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

// context serve porque este componente é reutilizável 

function AddComponents({
  openPopUpComponent,
  closePopUpComponent,
  projectInfo,
  context,
}) {
  // Exporta o componente ActivityLogs como padrão
  const { projectId } = useParams();
    // Acessa o token do utilizador e a URL da API através de stores personalizadas
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  // Acessa o estado global dos componentes do projeto e a função para atualizá-lo
  const projectComponents = useProjectStore((state) => state.projectComponents);
  const setProjectComponents = useProjectStore(
    (state) => state.setProjectComponents
  );

  // Define estados locais 
  const [components, setComponents] = useState([]); 
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Função para lidar com o tempo limite da sessão
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  // Função para traduzir o texto
  const { t } = useTranslation();

  // Obtém os componentes disponíveis para o local de trabalho selecionado
  useEffect(() => {
    const getAvailableComponents = async () => {
      if (!projectInfo.workplace.name) {
        setError(t("PleaseSelectAWorkplaceFirst"));
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/components/availableGroupedByName?workplaceId=${projectInfo.workplace.id}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setComponents(data);  // Define os componentes disponíveis
          setCurrentIndex(data.length); 
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); //Sessão terminada
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 404) {
          setComponents([]); // Define os componentes como um array vazio
        }
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    getAvailableComponents();
  }, [apiUrl, token, projectInfo.workplace]); // Atualiza a lista de componentes disponíveis sempre que o local de trabalho, o URL da API ou o token do utilizador são alterados

  // Função para lidar com a alteração do valor de entrada
  const handleInputChange = (value) => {
    setInputValue(value);
  };

  // Mapeia os componentes disponíveis para o formato de opções do React Select
  const options = components.map((component, index) => ({
    value: component,
    label: component,
    id: index + 1, // Adiciona 1 ao índice para evitar que o índice 0 seja considerado falso
    isDisabled: projectComponents.some(
      (projectComponent) => projectComponent.name === component
    ),
  }));

  // Define as opções padrão para a animação Lottie
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Função para lidar com a alteração da seleção
  const handleSelectChange = (selectedOption) => {
    setSelectedComponent(selectedOption);
  };

  // Função para lidar com a submissão do formulário de adição de componentes
  const handleSubmit = async () => {
    if (!selectedComponent) return; // Sai da função se não houver componente selecionado

    const data = {
      name: selectedComponent.value, 
    };

    if (context === "editProject") {
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectId}/addComponent`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              component: data,
            }),
          }
        );
        if (response.status === 200) {
          setAnimationPlayed(true);  // Define a animação como reproduzida
          setShowSuccessText(true); // Exibe o texto de sucesso
          setSelectedComponent(null); // Limpa o componente selecionado
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
          console.error("Component already exists in the project");
        } else if (response.status === 404) {
          console.error("Project not found");
        } else {
          console.error("Failed to add component to project");
        }
      } catch (error) {
        console.error("Error adding component to project:", error);
      }
    } else {
      const data = {
        id: currentIndex + 1, // Adiciona 1 ao índice para evitar que o índice 0 seja considerado falso
        name: selectedComponent.value,
      };
      setProjectComponents([...projectComponents, data]);
      setAnimationPlayed(true);
      setShowSuccessText(true);
      setSelectedComponent(null);
    }
  };

  return (
    // Renderiza o componente Modal
    <Modal
      show={openPopUpComponent}
      size="xl"
      onClose={() => {
        closePopUpComponent(); // Fecha o modal
        setSelectedComponent(null); // Limpa o componente selecionado
        setError(""); // Limpa a mensagem de erro
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        {/* Renderiza o conteúdo do modal */}
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("AddComponents")}
          </h3>
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            <h4> {t("CreateNewComponentOrChooseOneOfTheExistingOnes")} </h4>
            <div className="flex items-start space-x-4 min-h-[25rem] relative">
              <div className="text center z-10">
                {/* Renderiza o componente CreatableSelect */}
                <CreatableSelect
                  options={options}
                  onChange={handleSelectChange}
                  onInputChange={handleInputChange}
                  isOptionDisabled={(option) =>
                    option.isDisabled || inputValue.length > 20
                  }
                  formatOptionLabel={(option) => (
                    <div>
                      {option.label}
                      {option.isDisabled ? <TbLockFilled /> : null} {/* Renderiza o ícone de bloqueio se o utilizador já o tiver na lista */}
                    </div>
                  )}
                  placeholder={t("SearchComponents")}
                  value={selectedComponent}
                  isDisabled={!projectInfo.workplace}
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
                          setAnimationPlayed(false);  // Define a animação como não reproduzida
                          setTimeout(() => setShowSuccessText(false), 500); // Define o texto de sucesso como falso após 500ms
                        },
                      },
                    ]}
                  />
                </div>
                {showSuccessText && (
                  // Renderiza o texto de sucesso
                  <div className="animate-pulse text-green-500 font-bold absolute bottom-0">
                    {t("ComponentAdded")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedComponent || !projectInfo.workplace}
              >
                {t("AddComponent")}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddComponents;

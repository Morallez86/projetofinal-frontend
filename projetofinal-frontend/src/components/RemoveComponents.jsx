import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import { Checkbox, Label } from "flowbite-react";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";
import useProjectStore from "../Stores/ProjectStore";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import { useTranslation } from "react-i18next";
import useUserStore from "../Stores/UserStore";
import { useNavigate } from "react-router-dom";

function RemoveComponents({
  openPopUpComponentsRemove,
  closePopUpComponentsRemove,
  projectInfo,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl); //api url
  const token = useUserStore((state) => state.token); //token
  const projectComponents = useProjectStore((state) => state.projectComponents); //componentes do projeto
  const setProjectComponents = useProjectStore( //setar componentes do projeto
    (state) => state.setProjectComponents
  );

  const [animationPlayed, setAnimationPlayed] = useState(false); //animação
  const [filter, setFilter] = useState(""); //filtro
  const [selectedComponentIds, setSelectedComponentIds] = useState([]); //componentes selecionados
  const [showSuccessText, setShowSuccessText] = useState(false); //texto de sucesso
  const [filteredComponents, setFilteredComponents] = useState([]); //componentes filtrados
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { //função para timeout
    navigate("/", { state: { showSessionTimeoutModal: true } }); //navegar para a página inicial
  };

  const { t } = useTranslation(); //tradução

  useEffect(() => {
    if (projectInfo) { //se houver informações do projeto
      setFilteredComponents( //set dos componentes filtrados
        projectInfo.components.filter((component) =>
          component.name.toLowerCase().includes(filter.toLowerCase()) 
        )
      );
    } else {
      setFilteredComponents(
        projectComponents.filter((component) =>
          component.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, projectInfo, projectComponents]); //dependências

  const defaultOptions = { //opções padrão
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (id) => { //função para checkbox
    if (selectedComponentIds.includes(id)) {
      setSelectedComponentIds(
        selectedComponentIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedComponentIds([...selectedComponentIds, id]);
    }
  };

  const handleRemoveComponents = async () => { //função para remover componentes
    if (projectInfo) {
      
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectInfo.id}/removeComponents`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedComponentIds),
          }
        );
        if (response.status === 200) { //se a resposta for 200
          const updatedComponents = projectInfo.components.filter(
            (component) => !selectedComponentIds.includes(component.id)
          );
          setProjectComponents(updatedComponents);
          setAnimationPlayed(true);
          setTimeout(() => {
            closePopUpComponentsRemove();
          }, 2000);
        } else if (response.status === 401) { //se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") { //se o token for inválido
            handleSessionTimeout(); // timeout
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) { //se a resposta for 500
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting project components:", error);
      }
    } else {
      const updatedProjectComponents = projectComponents.filter(
        (component) => !selectedComponentIds.includes(component.id)
      );
      setProjectComponents(updatedProjectComponents);
      setAnimationPlayed(true);
    }
  };

  return (
    <>
      <Modal
        show={openPopUpComponentsRemove}
        size="xl"
        onClose={() => {
          closePopUpComponentsRemove();
          setSelectedComponentIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {t("removeComponents")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>
                  {t("You can remove one or more components at the same time")}
                </h4>
                <TextInput
                  type="text"
                  placeholder={t("SearchComponents")}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredComponents.map((component) => (
                    <div key={component.id} className="flex items-center gap-2">
                      <Checkbox
                        id={component.id.toString()}
                        checked={selectedComponentIds.includes(component.id)}
                        onChange={() => handleCheckboxChange(component.id)}
                      />
                      <Label htmlFor={component.id.toString()}>
                        {component.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveComponents}
                  disabled={selectedComponentIds.length === 0}
                >
                  {t("RemoveComponents")}
                </Button>
              </div>
              <div
                id="icon-element"
                className="pointer-events-none flex items-center justify-center h-full relative"
              >
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
                        setShowSuccessText(true);
                        setTimeout(() => setShowSuccessText(false), 1500);
                      },
                    },
                  ]}
                />
                {showSuccessText && (
                  <div className="animate-pulse text-green-500 font-bold absolute bottom-0 mb-4">
                    {t("ComponentRemoved")}
                  </div>
                )}
                <Tooltip
                  anchorSelect="#icon-element"
                  content={t("Click to remove components")}
                  place="top"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveComponents;

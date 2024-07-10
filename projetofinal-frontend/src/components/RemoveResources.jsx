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

function RemoveResources({
  openPopUpResourcesRemove,
  closePopUpResourcesRemove,
  projectInfo,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl); // obter API URL
  const token = useUserStore((state) => state.token); // obter token
  const projectResources = useProjectStore((state) => state.projectResources); // obter recursos do projeto
  const setProjectResources = useProjectStore( // set dos recursos do projeto
    (state) => state.setProjectResources
  );

  const [animationPlayed, setAnimationPlayed] = useState(false); // estado para animação
  const [filter, setFilter] = useState(""); // estado para filtro
  const [selectedResourceIds, setSelectedResourceIds] = useState([]); // estado para recursos selecionados
  const [showSuccessText, setShowSuccessText] = useState(false); // estado para mostrar texto de sucesso
  const [filteredResources, setFilteredResources] = useState([]); // estado para recursos filtrados
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // função para timeout
    navigate("/", { state: { showSessionTimeoutModal: true } }); // navegar para a página inicial
  };

  const { t } = useTranslation(); // tradução

  useEffect(() => {
    if (projectInfo) {
      setFilteredResources(
        projectInfo.resources.filter((resource) =>
          resource.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredResources(
        projectResources.filter((resource) =>
          resource.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, projectInfo, projectResources]);

  const defaultOptions = { // opções padrão
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (id) => { // função para checkbox
    if (selectedResourceIds.includes(id)) {
      setSelectedResourceIds(
        selectedResourceIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedResourceIds([...selectedResourceIds, id]);
    }
  };

  const handleRemoveResources = async () => { // função para remover recursos
    if (projectInfo) {
      console.log(token);
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectInfo.id}/removeResources`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedResourceIds),
          }
        );
        if (response.status === 200) { // se o status for 200
          const updatedResources = projectInfo.resources.filter(
            (resource) => !selectedResourceIds.includes(resource.id)
          );
          setProjectResources(updatedResources);
          setAnimationPlayed(true);
          setTimeout(() => {
            closePopUpResourcesRemove();
          }, 2000);
        } else if (response.status === 401) { // se o status for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") { // se a mensagem de erro for "Invalid token"
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) { // se o status for 500
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting project resources:", error);
      }
    } else {
      const updatedProjectResources = projectResources.filter(
        (resource) => !selectedResourceIds.includes(resource.id)
      );
      setProjectResources(updatedProjectResources);
      setAnimationPlayed(true);
    }
  };

  return (
    <>
      <Modal
        show={openPopUpResourcesRemove}
        size="xl"
        onClose={() => {
          closePopUpResourcesRemove();
          setSelectedResourceIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {t("removeResources")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>
                  {t("You can remove one or more resources at the same time")}
                </h4>
                <TextInput
                  type="text"
                  placeholder={t("SearchResources")}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="flex items-center gap-2">
                      <Checkbox
                        id={resource.id.toString()}
                        checked={selectedResourceIds.includes(resource.id)}
                        onChange={() => handleCheckboxChange(resource.id)}
                      />
                      <Label htmlFor={resource.id.toString()}>
                        {resource.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveResources}
                  disabled={selectedResourceIds.length === 0}
                >
                  {t("RemoveResources")}
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
                    {t("ResourceRemovedSuccessfully")}
                  </div>
                )}
                <Tooltip
                  anchorSelect="#icon-element"
                  content={t("ClickToRemoveResources")}
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

export default RemoveResources;

import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function RemoveInterests({
  openPopUpInterestRemove,
  closePopUpInterestRemove,
  context,
  projectInfo,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl); //api url
  const userInterests = useUserStore((state) => state.interests); //interesses do utilizador
  const projectInterests = useProjectStore((state) => state.projectInterests); //interesses do projeto
  const token = useUserStore((state) => state.token); //token do utilizador 
  const setUserInterests = useUserStore((state) => state.setInterests); //set dos interesses do utilizador
  const setProjectInterests = useProjectStore( //set dos interesses do projeto
    (state) => state.setProjectInterests
  );

  const [filter, setFilter] = useState(""); //filtro
  const [selectedInterestIds, setSelectedInterestIds] = useState([]); //interesses selecionados
  const [animationPlayed, setAnimationPlayed] = useState(false); //animação
  const [showSuccessText, setShowSuccessText] = useState(false); //texto de sucesso
  const [filteredInterests, setFilteredInterests] = useState([]); //interesses filtrados
  const navigate = useNavigate();  
  const handleSessionTimeout = () => { //função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); //navegar para a página inicial
  };

  const { t } = useTranslation(); //tradução

  useEffect(() => {
    if (context === "user") { //se o contexto for o utilizador
      setFilteredInterests(
        userInterests.filter((interest) =>
          interest.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else if (context === "editProject" && projectInfo) { //se o contexto for editar projeto e houver informações do projeto
      setFilteredInterests(
        projectInfo.interests.filter((interest) =>
          interest.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else { //se não
      setFilteredInterests(
        projectInterests.filter((interest) =>
          interest.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, context, userInterests, projectInfo, projectInterests]); //dependências

  const defaultOptions = {  //opções da animação
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (id) => { //função para lidar com a mudança de checkbox
    if (selectedInterestIds.includes(id)) { 
      setSelectedInterestIds(
        selectedInterestIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedInterestIds([...selectedInterestIds, id]);
    }
  };

  const handleRemoveInterests = async () => { //função para lidar com a remoção de interesses
    if (context === "user") { //se o contexto for o utilizador
      try {
        const response = await fetch(`${apiUrl}/interests`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedInterestIds),
        });
        if (response.status === 204) { //se a resposta for 204
          const updatedInterests = userInterests.filter(
            (interest) => !selectedInterestIds.includes(interest.id)
          );
          setUserInterests(updatedInterests);
          setAnimationPlayed(true);
        } else if (response.status === 401) { //se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // timeout
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) { //se a resposta for 500
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting interests:", error);
      }
    } else if (context === "editProject" && projectInfo) { //se o contexto for editar projeto e houver informações do projeto
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectInfo.id}/removeInterests`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedInterestIds),
          }
        );
        if (response.status === 200) { //se a resposta for 200
          const updatedInterests = projectInfo.interests.filter(
            (interest) => !selectedInterestIds.includes(interest.id)
          );
          setProjectInterests(updatedInterests);
          setAnimationPlayed(true);
          setTimeout(() => {
            closePopUpInterestRemove();
          }, 2000);
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") { //se a mensagem de erro for token inválido
            handleSessionTimeout(); // timeout
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) { //se a resposta for 500
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting project interests:", error);
      }
    } else {
      const updatedProjectInterests = projectInterests.filter(
        (interest) => !selectedInterestIds.includes(interest.id)
      );
      setProjectInterests(updatedProjectInterests);
      setAnimationPlayed(true);
    }
  };

  return (
    <>
      <Modal
        show={openPopUpInterestRemove}
        size="xl"
        onClose={() => {
          closePopUpInterestRemove();
          setSelectedInterestIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {t("RemoveInterests")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4> {t("YouCanRemoveOneOrMoreInterestsAtTheSimeTime")} </h4>
                <TextInput
                  type="text"
                  placeholder={t("SearchInterests")}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredInterests.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-2">
                      <Checkbox
                        id={interest.id.toString()}
                        checked={selectedInterestIds.includes(interest.id)}
                        onChange={() => handleCheckboxChange(interest.id)}
                      />
                      <Label htmlFor={interest.id.toString()}>
                        {interest.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveInterests}
                  disabled={selectedInterestIds.length === 0}
                >
                  {t("RemoveInterests")}
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
                    {t("InterestRemoved")}
                  </div>
                )}
                <Tooltip
                  anchorSelect="#icon-element"
                  content="Click to delete this interest from your profile"
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

export default RemoveInterests;

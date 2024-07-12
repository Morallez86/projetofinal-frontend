import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";
import useProjectStore from "../Stores/ProjectStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function RemoveSkills({
  openPopUpSkillsRemove,
  closePopUpSkillsRemove,
  context,
  projectInfo,
}) {
  
  const apiUrl = useApiStore((state) => state.apiUrl); //api url
  const userSkills = useUserStore((state) => state.skills); //skills do utilizador
  const projectSkills = useProjectStore((state) => state.projectSkills); //skills do projeto
  const token = useUserStore((state) => state.token); //token do utilizador 
  const setUserSkills = useUserStore((state) => state.setSkills); //set das skills do utilizador
  const setProjectSkills = useProjectStore((state) => state.setProjectSkills); //set das skills do projeto

  const [animationPlayed, setAnimationPlayed] = useState(false); //estado para animação
  const [filter, setFilter] = useState(""); //estado para filtro
  const [selectedSkillIds, setSelectedSkillIds] = useState([]); //estado para skills selecionadas
  const [showSuccessText, setShowSuccessText] = useState(false); //estado para mostrar texto de sucesso
  const [filteredSkills, setFilteredSkills] = useState([]); //estado para skills filtradas
  const navigate = useNavigate();
  const handleSessionTimeout = () => { //função para timeout
    navigate("/", { state: { showSessionTimeoutModal: true } }); //navegar para a página inicial
  };

  const { t } = useTranslation();

  useEffect(() => {
    if (context === "user") { //se o contexto for o utilizador
      setFilteredSkills(
        userSkills.filter((skill) =>
          skill.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else if (context === "editProject" && projectInfo) { //se o contexto for editar projeto e houver informações do projeto
      setFilteredSkills(
        projectInfo.skills.filter((skill) =>
          skill.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredSkills(
        projectSkills.filter((skill) =>
          skill.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, context, userSkills, projectInfo, projectSkills]); //quando o filtro, contexto, skills do utilizador, informações do projeto e skills do projeto mudam

  const defaultOptions = { //opções para a animação
    loop: false, 
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (id) => { //função para checkbox
    if (selectedSkillIds.includes(id)) {
      setSelectedSkillIds(
        selectedSkillIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedSkillIds([...selectedSkillIds, id]);
    }
  };

  const handleRemoveSkills = async () => { //função para remover skills
    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/skills`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedSkillIds),
        });
        if (response.status === 204) { //se o status for 204
          const updatedSkills = userSkills.filter(
            (skill) => !selectedSkillIds.includes(skill.id)
          );
          setUserSkills(updatedSkills);
          setAnimationPlayed(true);
        } else if (response.status === 401) { //se o status for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // timeout
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) {
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting skills:", error);
      }
    } else if (context === "editProject" && projectInfo) { //se o contexto for editar projeto e houver informações do projeto
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectInfo.id}/removeSkills`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedSkillIds),
          }
        );
        if (response.status === 200) { //se o status for 200
          const updatedSkills = projectInfo.skills.filter(
            (skill) => !selectedSkillIds.includes(skill.id)
          );
          setProjectSkills(updatedSkills);
          setAnimationPlayed(true);
          setTimeout(() => {
            closePopUpSkillsRemove();
          }, 2000);
        } else if (response.status === 401) { //se o status for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // timeout
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) { //se o status for 500
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting project skills:", error);
      }
    } else {
     
      const updatedProjectSkills = projectSkills.filter(
        (skill) => !selectedSkillIds.includes(skill.id)
      );
      setProjectSkills(updatedProjectSkills);
      setAnimationPlayed(true);
    }
  };

  return (
    <>
      <Modal
        show={openPopUpSkillsRemove}
        size="xl"
        onClose={() => {
          closePopUpSkillsRemove();
          setSelectedSkillIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {t("RemoveSkill")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4> {t("YouCanRemoveOneOrMoreSkillsAtTheSameTime")}</h4>
                <TextInput
                  type="text"
                  placeholder={t("SearchForASkill")}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <Checkbox
                        id={skill.id.toString()}
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={() => handleCheckboxChange(skill.id)}
                      />
                      <Label htmlFor={skill.id.toString()}>{skill.name}</Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveSkills}
                  disabled={selectedSkillIds.length === 0}
                >
                  {t("RemoveSelectedSkills")}
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
                    {t("RemoveSuccessfully")}
                  </div>
                )}
                <Tooltip
                  anchorSelect="#icon-element"
                  content="Click to delete this skill from your profile"
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

export default RemoveSkills;

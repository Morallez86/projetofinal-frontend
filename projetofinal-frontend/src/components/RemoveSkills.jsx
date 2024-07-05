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

function RemoveSkills({
  openPopUpSkillsRemove,
  closePopUpSkillsRemove,
  context,
  projectInfo,
}) {
  console.log(projectInfo);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const userSkills = useUserStore((state) => state.skills);
  const projectSkills = useProjectStore((state) => state.projectSkills);
  const token = useUserStore((state) => state.token);
  const setUserSkills = useUserStore((state) => state.setSkills);
  const setProjectSkills = useProjectStore((state) => state.setProjectSkills);

  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    if (context === "user") {
      setFilteredSkills(
        userSkills.filter((skill) =>
          skill.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else if (context === "editProject" && projectInfo) {
      console.log(projectInfo)
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
  }, [filter, context, userSkills, projectInfo, projectSkills]);

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (id) => {
    if (selectedSkillIds.includes(id)) {
      setSelectedSkillIds(
        selectedSkillIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedSkillIds([...selectedSkillIds, id]);
    }
  };

  const handleRemoveSkills = async () => {
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
        if (response.status === 204) {
          const updatedSkills = userSkills.filter(
            (skill) => !selectedSkillIds.includes(skill.id)
          );
          setUserSkills(updatedSkills);
          setAnimationPlayed(true);
        } else if (response.status === 500) {
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting skills:", error);
      }
    } else if (context === "editProject" && projectInfo) {
      try {
        console.log(selectedSkillIds);
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
        if (response.status === 200) {
          const updatedSkills = projectInfo.skills.filter(
            (skill) => !selectedSkillIds.includes(skill.id)
          );
          setProjectSkills(updatedSkills);
          setAnimationPlayed(true);
        } else if (response.status === 500) {
          console.log("Internal server error");
        }
      } catch (error) {
        console.error("Error deleting project skills:", error);
      }
    } else {
      // If context is not for users, save project skills to Zustand store
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

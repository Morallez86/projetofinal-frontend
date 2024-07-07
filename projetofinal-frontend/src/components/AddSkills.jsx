import React, { useState } from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore.js";
import { TbLockFilled } from "react-icons/tb";
import useApiStore from "../Stores/ApiStore";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import useSkillStore from "../Stores/SkillStore";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddSkills({ openPopUpSkills, closePopUpSkills, context }) {
  const { projectId } = useParams();
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const userSkills = useUserStore((state) => state.skills);
  const setUserSkills = useUserStore((state) => state.setSkills);
  const projectSkills = useProjectStore((state) => state.projectSkills);
  const setProjectSkills = useProjectStore((state) => state.setProjectSkills);

  const { skills, addSkill } = useSkillStore();

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const { t } = useTranslation();

  const skillCategoryMapping = {
    Software: 200,
    Knowledge: 100,
    Hardware: 300,
    Tools: 400,
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const options = skills.map((skill) => ({
    value: skill.name,
    label: skill.name,
    type: skill.type,
    id: skill.id,
    isDisabled:
      context === "user"
        ? userSkills.some((userSkill) => userSkill.name === skill.name)
        : projectSkills.some(
            (projectSkill) => projectSkill.name === skill.name
          ),
  }));

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedSkill(selectedOption);
    const selectedSkill = skills.find(
      (skill) => skill.name === selectedOption.value
    );

    if (selectedSkill) {
      setSelectedCategory(
        Object.keys(skillCategoryMapping).find(
          (key) => skillCategoryMapping[key] === selectedSkill.type
        )
      );
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const isSkillInOptions = options.some(
    (option) => option.value === selectedSkill?.value
  );

  const handleSubmit = async () => {
    console.log(context);
    const data = [
      {
        id: isSkillInOptions ? selectedSkill.id : null,
        name: selectedSkill.value,
        type: skillCategoryMapping[selectedCategory],
      },
    ];

    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/skills`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          const newSkills = await response.json();
          setUserSkills([...userSkills, ...newSkills]);
          if (!skills.some((skill) => skill.name === data[0].name)) {
            addSkill(data[0]);
          }
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedSkill(null);
          setSelectedCategory(null);
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 500) {
          console.error("Internal Server Error");
        }
      } catch (error) {
        console.error("Error adding skill:", error);
      }
    } else if (context === "editProject") {
      const data = {
        id: isSkillInOptions ? selectedSkill.id : null,
        name: selectedSkill.value,
        type: skillCategoryMapping[selectedCategory],
      };
      try {
        const response = await fetch(
          `${apiUrl}/projects/${projectId}/addSkill`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              skill: data,
            }),
          }
        );
        if (response.status === 200) {
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedSkill(null);
          setSelectedCategory(null);
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else if (response.status === 409) {
          console.error("Skill already exists in the project");
        } else if (response.status === 404) {
          console.error("Project not found");
        } else {
          console.error("Failed to add skill to project");
        }
      } catch (error) {
        console.error("Error adding skill to project:", error);
      }
    } else {
      // If context is not for users, save project skills to Zustand store
      setProjectSkills([...projectSkills, ...data]);
      if (!skills.some((skill) => skill.name === data[0].name)) {
        addSkill(data[0]);
      }
      setAnimationPlayed(true);
      setShowSuccessText(true);
      setSelectedSkill(null);
      setSelectedCategory(null);
    }
  };

  return (
    <Modal
      show={openPopUpSkills}
      size="xl"
      onClose={() => {
        closePopUpSkills();
        setSelectedSkill(null);
        setSelectedCategory(null);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("RegisterSkills")}
          </h3>
          <div className="space-y-3">
            <h4> {t("CreateOrChooseSkill")} </h4>
            <div className="flex items-start space-x-4 min-h-[25rem] relative">
              <div className="text center z-10">
                <Dropdown
                  label={selectedCategory || t("SelectCategory")}
                  dismissOnClick={true}
                  disabled={isSkillInOptions}
                  value={selectedCategory}
                >
                  {Object.keys(skillCategoryMapping).map((category) => (
                    <Dropdown.Item
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
              <div className="text center z-10">
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
                      {option.isDisabled ? <TbLockFilled /> : null}
                    </div>
                  )}
                  placeholder={t("SearchForASkill")}
                  value={selectedSkill}
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
                    {t("SkillAdded")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedSkill || !selectedCategory}
              >
                {t("RegisterSkill")}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddSkills;

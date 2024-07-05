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

function AddComponents({
  openPopUpComponent,
  closePopUpComponent,
  projectInfo,
  context,
}) {
  const { projectId } = useParams();
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const projectComponents = useProjectStore((state) => state.projectComponents);
  const setProjectComponents = useProjectStore(
    (state) => state.setProjectComponents
  );

  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();

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
          setComponents(data);
        } else if (response.status === 404) {
          console.log("Components not found");
          setComponents([]);
        }
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    getAvailableComponents();
  }, [apiUrl, token, projectInfo.workplace]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const generateUniqueId = () => {
    return `component-${Math.random().toString(36).substr(2, 9)}`;
  };

  const options = components.map((component) => ({
    value: component,
    label: component,
    id: generateUniqueId(),
    isDisabled: projectComponents.some(
      (projectComponent) => projectComponent.name === component
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
    setSelectedComponent(selectedOption);
  };

  const handleSubmit = async () => {
    if (!selectedComponent) return;

    const data = {
      name: selectedComponent.value,
    };

    if (context === "editProject") {
      try {
        console.log(data)
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
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedComponent(null);
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
      setProjectComponents([...projectComponents, data]);
      setAnimationPlayed(true);
      setShowSuccessText(true);
      setSelectedComponent(null);
    }
  };

  return (
    <Modal
      show={openPopUpComponent}
      size="xl"
      onClose={() => {
        closePopUpComponent();
        setSelectedComponent(null);
        setError("");
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("AddComponents")}
          </h3>
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            <h4> {t("CreateNewComponentOrChooseOneOfTheExistingOnes")} </h4>
            <div className="flex items-start space-x-4 min-h-[25rem] relative">
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
                          setAnimationPlayed(false);
                          setTimeout(() => setShowSuccessText(false), 500);
                        },
                      },
                    ]}
                  />
                </div>
                {showSuccessText && (
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

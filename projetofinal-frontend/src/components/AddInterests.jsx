import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import { TbLockFilled } from "react-icons/tb";
import useApiStore from "../Stores/ApiStore";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import useInterestStore from "../Stores/InterestStore";
import { useTranslation } from "react-i18next";

function AddInterests({ openPopUpInterests, closePopUpInterests, context }) {
  const { projectId } = useParams();
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);

  const userInterests = useUserStore((state) => state.interests);
  const setUserInterests = useUserStore((state) => state.setInterests);

  const projectInterests = useProjectStore((state) => state.projectInterests);
  const setProjectInterests = useProjectStore(
    (state) => state.setProjectInterests
  );

  const { interests, addInterest } = useInterestStore();

  const [selectedInterest, setSelectedInterest] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const { t } = useTranslation();

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const options = interests.map((interest) => {
    let isDisabled = false;

    if (context === "user") {
      // Disable if the interest exists in userInterests
      isDisabled = userInterests.some(
        (userInterest) => userInterest.name === interest.name
      );
    } else if (context === "editProject") {
      // Disable if the interest exists in projectInterests
      isDisabled = projectInterests.some(
        (projectInterest) => projectInterest.name === interest.name
      );
    } else {
      isDisabled = projectInterests.some(
        (projectInterest) => projectInterest.name === interest.name
      );
    }

    return {
      value: interest.name,
      label: interest.name,
      id: interest.id,
      isDisabled,
    };
  });

  const handleSelectChange = (selectedOption) => {
    setSelectedInterest(selectedOption);
  };

  const isInterestInOptions = options.some(
    (option) => option.value === selectedInterest?.value
  );

  const handleSubmit = async () => {
    const data = [
      {
        id: selectedInterest?.id || null,
        name: selectedInterest?.value,
      },
    ];

    if (!selectedInterest) {
      return;
    }

    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/interests`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          const newInterests = await response.json();
          setUserInterests([...userInterests, ...newInterests]);
          if (!interests.some((interest) => interest.name === data[0].name)) {
            addInterest(data[0]);
          }
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedInterest(null);
        } else if (response.status === 500) {
          console.error("Internal Server Error");
        }
      } catch (error) {
        console.error("Error adding interest:", error);
      }
    } else if (context === "editProject") {
      const data = {
        id: isInterestInOptions ? selectedInterest.id : null,
        name: selectedInterest.value,
      };
      try {
        console.log(data);
        const response = await fetch(
          `${apiUrl}/projects/${projectId}/addInterest`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              interest: data,
            }),
          }
        );
        if (response.status === 200) {
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedInterest(null);
        } else if (response.status === 409) {
          console.error("Interest already exists in the project");
        } else if (response.status === 404) {
          console.error("Project not found");
        } else {
          console.error("Failed to add interest to project");
        }
      } catch (error) {
        console.error("Error adding interest to project:", error);
      }
    } else {
      setProjectInterests([...projectInterests, ...data]);
      if (!interests.some((interest) => interest.name === data[0].name)) {
        addInterest(data[0]);
      }
      setAnimationPlayed(true);
      setShowSuccessText(true);
      setSelectedInterest(null);
    }
  };

  return (
    <Modal
      show={openPopUpInterests}
      size="xl"
      onClose={() => {
        closePopUpInterests();
        setSelectedInterest(null);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("AddInterest")}
          </h3>
          <div className="space-y-3">
            <h4>{t("CreateOrChooseInterest")}</h4>
            <div className="flex items-start space-x-4 min-h-[25rem] relative">
              <div className="text-center z-10">
                <CreatableSelect
                  options={options}
                  className="mt-3"
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
                  placeholder={t("SearchForAInterest")}
                  value={selectedInterest}
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
                <div
                  style={{
                    transform: "scale(3.5)",
                  }}
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
                          setTimeout(() => setShowSuccessText(false), 500);
                        },
                      },
                    ]}
                  />
                </div>
                {showSuccessText && (
                  <div className="animate-pulse text-green-500 font-bold absolute bottom-0">
                    {t("InterestAdded")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleSubmit} disabled={!selectedInterest}>
                {t("AddInterest")}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddInterests;

import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore.js";
import useProjectStore from "../Stores/ProjectStore.js";
import useApiStore from "../Stores/ApiStore.js";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import { TbLockFilled } from "react-icons/tb";

function AddComponents({ openPopUpComponent, closePopUpComponent }) {
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

  useEffect(() => {
    const getAllComponents = async () => {
      try {
        const response = await fetch(`${apiUrl}/components`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setComponents(data);
          console.log(data);
        } else if (response.status === 404) {
          console.log("Components not found");
        }
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    getAllComponents();
  }, [apiUrl, token]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  console.log(components);

  const options = components.map((component) => ({
    value: component.name,
    label: component.name,
    id: component.id,
    isDisabled: projectComponents.some(
      (projectComponent) => projectComponent.name === component.name
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
    const data = [
      {
        id: selectedComponent.id,
        name: selectedComponent.value,
      },
    ];
    console.log(data);

    setProjectComponents([...projectComponents, ...data]);
    setAnimationPlayed(true);
    setShowSuccessText(true);
    setSelectedComponent(null);
  };

  return (
    <Modal
      show={openPopUpComponent}
      size="xl"
      onClose={() => {
        closePopUpComponent();
        setSelectedComponent(null);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            Register Component
          </h3>
          <div className="space-y-3">
            <h4>Create new component or Choose one of the existing ones</h4>
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
                  placeholder="Select/write component name"
                  value={selectedComponent}
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
                    Added with success
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleSubmit} disabled={!selectedComponent}>
                Add Component
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddComponents;

import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore.js";
import useProjectStore from "../Stores/ProjectStore.js";
import useApiStore from "../Stores/ApiStore.js";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import { TbLockFilled } from "react-icons/tb";

function AddResources({ openPopUpResources, closePopUpResources }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const projectResources = useProjectStore((state) => state.projectResources);
  const setProjectResources = useProjectStore(
    (state) => state.setProjectResources
  );

  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  useEffect(() => {
    const getAllResources = async () => {
      try {
        const response = await fetch(`${apiUrl}/resources`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setResources(data);
          console.log(data);
        } else if (response.status === 404) {
          console.log("Resources not found");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    getAllResources();
  }, [apiUrl, token]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const options = resources.map((resource) => ({
    value: resource.name,
    label: resource.name,
    id: resource.id,
    isDisabled: projectResources.some(
      (projectResource) => projectResource.name === resource.name
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
    setSelectedResource(selectedOption);
  };

  const handleSubmit = async () => {
    const data = [
      {
        id: selectedResource.id,
        name: selectedResource.value,
      },
    ];
    console.log(data);

    setProjectResources([...projectResources, ...data]);
    setAnimationPlayed(true);
    setShowSuccessText(true);
    setSelectedResource(null);
  };

  return (
    <Modal
      show={openPopUpResources}
      size="xl"
      onClose={() => {
        closePopUpResources();
        setSelectedResource(null);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            Add Resource
          </h3>
          <div className="space-y-3">
            <h4>Create a new resource or choose an existing one</h4>
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
                  placeholder="Select/write resource name"
                  value={selectedResource}
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
              <Button onClick={handleSubmit} disabled={!selectedResource}>
                Add Resource
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddResources;

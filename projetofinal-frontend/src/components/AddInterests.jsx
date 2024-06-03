import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import { TbLockFilled } from "react-icons/tb";
import useApiStore from "../Stores/ApiStore";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";

function AddInterests({ openPopUpInterests, closePopUpInterests, context }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  
  const userInterests = useUserStore((state) => state.interests);
  const setUserInterests = useUserStore((state) => state.setInterests);
  
  const projectInterests = useProjectStore((state) => state.projectInterests);
  const setProjectInterests = useProjectStore((state) => state.setProjectInterests);
  
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const getAllInterests = async () => {
      try {
        const response = await fetch(`${apiUrl}/interests`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setInterests(data);
        } else if (response.status === 404) {
          console.log("Interests not found");
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    getAllInterests();
  }, [apiUrl, token]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const options = interests.map((interest) => ({
    value: interest.name,
    label: interest.name,
    isDisabled: context === 'user' 
      ? userInterests.some((userInterest) => userInterest.name === interest.name)
      : projectInterests.some((projectInterest) => projectInterest.name === interest.name),
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedInterest(selectedOption);
  };

  const handleSubmit = async () => {
    const data = [{ name: selectedInterest.value }];

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
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setSelectedInterest(null);
        } else if (response.status === 500) {
          console.error("Internal Server Error");
        }
      } catch (error) {
        console.error("Error adding interest:", error);
      }
    } else {
      setProjectInterests([...projectInterests, ...data]);
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
            Register Interest
          </h3>
          <div className="space-y-3">
            <h4>Create new interest or Choose one of the existing ones</h4>
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
                  placeholder="Select/Write interest name"
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
                    Added with success
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleSubmit} disabled={!selectedInterest}>
                Add Interest
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddInterests;

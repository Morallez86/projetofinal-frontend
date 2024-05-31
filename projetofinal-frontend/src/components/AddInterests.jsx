import React from "react";
import { Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import useUserStore from "../Stores/UserStore";
import { TbLockFilled } from "react-icons/tb";
import useApiStore from "../Stores/ApiStore";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function AddInterests({ openPopUpInterests, closePopUpInterests }) {
  const token = useUserStore((state) => state.token);
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const userInterests = useUserStore((state) => state.interests);
  const setUserInterests = useUserStore((state) => state.setInterests);
  const [inputValue, setInputValue] = useState("");
  const apiUrl = useApiStore((state) => state.apiUrl);
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
    getAllInterests();
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

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
        console.log(data);
      } else if (response.status === 404) {
        console.log("Interests not found");
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  const options = interests.map((interest) => ({
    value: interest.name,
    label: interest.name,
    isDisabled: userInterests.some(
      (userInterest) => userInterest.name === interest.name
    ),
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedInterest(selectedOption);
  };

  const handleSubmit = async () => {
    const data = [
      {
        name: selectedInterest.value,
      },
    ];

    const response = await fetch(
      "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/interests",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (response.status === 201) {
      console.log("Interest added successfully");
      setAnimationPlayed(true);
      setShowSuccessText(true);
      setUserInterests([...userInterests, data[0]]);
    } else if (response.status === 500) {
      console.error("Internal Server Error");
    }
  };

  return (
    <>
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
            {" "}
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Interest
            </h3>
            <div className="space-y-3">
              <h4>Create new interest or Choose one of the existing ones </h4>
              <div className="flex items-start space-x-4 min-h-[25rem] relative">
                <div className="text center z-10">
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
    </>
  );
}

export default AddInterests;

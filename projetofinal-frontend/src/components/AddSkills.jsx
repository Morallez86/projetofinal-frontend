import React from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import useUserStore from "../Stores/UserStore";
import { TbLockFilled } from "react-icons/tb";
import useApiStore from "../Stores/ApiStore";
import AddedAnimation from "../Assets/Added.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function AddSkills({ openPopUpSkills, closePopUpSkills }) {
  const token = useUserStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userSkills = useUserStore((state) => state.skills);
  const setUserSkills = useUserStore((state) => state.setSkills);
  const [inputValue, setInputValue] = useState("");
  const apiUrl = useApiStore((state) => state.apiUrl);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const skillCategoryMapping = {
    Software: 200,
    Knowledge: 100,
    Hardware: 300,
    Tools: 400,
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    getAllSkills();
  }, []);

  const getAllSkills = async () => {
    try {
      const response = await fetch(`${apiUrl}/skills`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSkills(data);
        console.log(data);
      } else if (response.status === 404) {
        console.log("Skills not found");
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const options = skills.map((skill) => ({
    value: skill.name,
    label: skill.name,
    type: skill.type,
    isDisabled: userSkills.some((userSkill) => userSkill.name === skill.name),
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
    const data = [
      {
        name: selectedSkill.value,
        type: skillCategoryMapping[selectedCategory],
      },
    ];

    console.log(data);

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
      console.log("Skill added successfully");
      console.log(newSkills);
      setUserSkills([...userSkills, ...newSkills]);
      setAnimationPlayed(true);
    } else if (response.status === 500) {
      console.error("Internal Server Error");
    }
  };

  return (
    <>
      <Modal
        show={openPopUpSkills}
        size="xl"
        onClose={() => {
          closePopUpSkills();
          setSelectedSkill(null);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Skill
            </h3>
            <div className="space-y-3">
              <h4>Create new skill or Choose one of the existing ones </h4>
              <div className="flex items-start space-x-4 min-h-[25rem] relative">
                <div className="text center z-10">
                  <Dropdown
                    label={selectedCategory || "Skill Category"}
                    dismissOnClick={true}
                    disabled={isSkillInOptions}
                  >
                    <Dropdown.Item
                      onClick={() => handleCategoryChange("Software")}
                    >
                      Software
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleCategoryChange("Knowledge")}
                    >
                      Knowledge
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleCategoryChange("Hardware")}
                    >
                      Hardware
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleCategoryChange("Tools")}
                    >
                      Tools
                    </Dropdown.Item>
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
                    placeholder="Select/write skill name"
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
                            setShowSuccessText(true);
                            setTimeout(() => setShowSuccessText(false), 1500);
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
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedSkill || !selectedCategory}
                >
                  Add Skill
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddSkills;

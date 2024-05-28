import React from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import useUserStore from "../Stores/UserStore";
import { TbLockFilled } from "react-icons/tb";

function AddSkills({ openPopUpSkills, closePopUpSkills }) {
  const token = useUserStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userSkills = useUserStore((state) => state.skills);
  const [inputValue, setInputValue] = useState("");

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
      const response = await fetch(
        "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/skills",
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
    isDisabled: userSkills.includes(skill.name),
  }));

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

    const response = await fetch(
      "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/skills",
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
      console.log("Skill added successfully");
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
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Skill
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">
                  Create new skill or Choose one of the existing ones{" "}
                </h4>
                <div className="flex items-center">
                  <div className="text center">
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
                </div>
                <div className="col-span-full mt-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedSkill || !selectedCategory}
                  >
                    Add to skills list
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddSkills;

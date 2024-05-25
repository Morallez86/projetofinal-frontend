import React from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import useUserStore from "../Stores/UserStore";

function AddSkills({ openPopUpSkills, closePopUpSkills }) {
  const token = useUserStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const skillCategoryMapping = {
    Software: 200,
    Knowledge: 100,
    Hardware: 300,
    Tools: 400,
  }

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
    value: skill.id,
    label: skill.name,
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedSkill(selectedOption);
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const isSkillInOptions = options.some(
    (option) => option.value === selectedSkill?.value
  );

  const handleSubmit = async () => {
    const data = {
      skill: selectedSkill.value,
      category: skillCategoryMapping[selectedCategory],
    };

    console.log(data);

    const response = await fetch("/your-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Data submitted successfully");
    } else {
      console.error("Error submitting data");
    }
  };

  return (
    <>
      <Modal show={openPopUpSkills} size="xl" onClose={closePopUpSkills} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Skill
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">Create New Skill</h4>
                <div className="flex items-center">
                  <div className="text center">
                    <Dropdown
                      label="Skill Category"
                      dismissOnClick={true}
                      disabled={isSkillInOptions}
                    >
                      <Dropdown.Item onClick={() => handleCategoryChange("Software")}>Software</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleCategoryChange("Knowledge")}>Knowledge</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleCategoryChange("Hardware")}>Hardware</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleCategoryChange("Tools")}>Tools</Dropdown.Item>
                    </Dropdown>
                    <CreatableSelect
                      options={options}
                      className="mt-3"
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                <div className="col-span-full mt-3">
                  <Button onClick={handleSubmit}>Create</Button>
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

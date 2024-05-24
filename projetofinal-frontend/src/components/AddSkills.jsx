import React from "react";
import { Dropdown, Modal } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";
import useUserStore from "../Stores/UserStore";
import { useEffect } from "react";

function AddSkills({ openPopUpSkills, closePopUpSkills }) {
  const token = useUserStore((state) => state.token);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getAllSkills();
  }, []);

  const getAllSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/skills/all",
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
                    <Dropdown label="Skill Category" dismissOnClick={true}>
                      <Dropdown.Item>Web Development</Dropdown.Item>
                      <Dropdown.Item>Mobile Development</Dropdown.Item>
                      <Dropdown.Item>Software Development</Dropdown.Item>
                      <Dropdown.Item>Graphic Design</Dropdown.Item>
                    </Dropdown>
                    <CreatableSelect options={options} className="mt-3" />
                  </div>
                </div>
              </div>
              <div>
                <h4>Add Existing Skill</h4>
                {/* Your form or content for adding an existing skill goes here */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddSkills;

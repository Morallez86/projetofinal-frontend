import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { Checkbox, Label } from "flowbite-react";

function RemoveSkills({ openPopUpSkillsRemove, closePopUpSkillsRemove }) {
  const userSkills = useUserStore((state) => state.skills);
  const token = useUserStore((state) => state.token);

  const [filter, setFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const filteredSkills = userSkills.filter((skill) =>
    skill.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCheckboxChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/skills",
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedSkills),
        }
      );
      if (response.status === 204) {
        console.log("Skills removed successfully");
        closePopUpSkillsRemove();
      } else if (response.status === 500) {
        console.log("Internet server error");
      }
    } catch (error) {
      console.error("Error deleting skills:", error);
    }
  };

  return (
    <>
      <Modal
        show={openPopUpSkillsRemove}
        size="xl"
        onClose={() => {
          closePopUpSkillsRemove();
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Skill
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">
                  You can remove one or more skills at the same time{" "}
                </h4>
                <TextInput
                  type="text"
                  placeholder="Filter skills"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mb-3"
                />
                <div className="flex flex-col items-start overflow-y-auto h-36">
                  {filteredSkills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 mb-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleCheckboxChange(skill)}
                      />
                      <Label htmlFor={skill}>{skill}</Label>
                    </div>
                  ))}
                </div>
                <div className="col-span-full mt-3">
                  <Button onClick={handleRemoveSkills}>
                    Remove selected skills
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

export default RemoveSkills;

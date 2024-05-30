import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function RemoveSkills({ openPopUpSkillsRemove, closePopUpSkillsRemove }) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const userSkills = useUserStore((state) => state.skills);
  const token = useUserStore((state) => state.token);
  const setSkills = useUserStore((state) => state.setSkills);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const filteredSkills = userSkills.filter((skill) =>
    skill.name.toLowerCase().includes(filter.toLowerCase())
  );

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (skillId) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const handleRemoveSkills = async () => {
    console.log(selectedSkillIds);
    try {
      const response = await fetch(`${apiUrl}/skills`, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedSkillIds),
      });
      if (response.status === 204) {
        console.log();
        const updatedSkills = userSkills.filter(
          (skill) => !selectedSkillIds.includes(skill.id)
        );
        setSkills(updatedSkills);
        setAnimationPlayed(true);
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
          setSelectedSkillIds([]);
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
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      <Checkbox
                        id={skill.id ? skill.id.toString() : ""}
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={() => handleCheckboxChange(skill.id)}
                      />
                      <Label htmlFor={skill.id ? skill.id.toString() : ""}>
                        {skill.name}
                      </Label>{" "}
                    </div>
                  ))}
                </div>
                <div className="col-span-full mt-3">
                  <Button onClick={handleRemoveSkills}>
                    Remove selected skills
                  </Button>
                </div>
              </div>
              <div id="icon-element" className="pointer-events-none">
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={!animationPlayed}
                  isPaused={!animationPlayed}
                  eventListeners={[
                    {
                      eventName: "complete",
                      callback: () => setAnimationPlayed(false),
                    },
                  ]}
                />
              </div>
              <Tooltip
                anchorSelect="#icon-element"
                content="Click to delete this skill from your profile"
                place="top"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveSkills;

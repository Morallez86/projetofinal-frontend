import React, { useState } from "react";
import { Card, TextInput, Label, Button, Select, Tooltip, Textarea } from "flowbite-react";
import useApiStore from '../Stores/ApiStore';
import { LuPlusCircle } from 'react-icons/lu';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';

function ProjectCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    motivation: "",
    status: "",
    maxUsers: 0,
    startingDate: "",
    plannedEndDate: "",
    components: [],
    resources: [],
    interests: [],
    skills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleAddSkill = (skill) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      skills: [...prevInfo.skills, skill],
    }));
  };

  const handleRemoveSkill = (skill) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      skills: prevInfo.skills.filter((s) => s.name !== skill.name),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectInfo),
      });

      if (response.status === 201) {
        console.log("Project created successfully");
      } else {
        console.error("Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Card className="bg-gray-200 transition-colors duration-200 w-3/4 h-auto mx-auto mt-10">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput
            id="title"
            type="text"
            name="title"
            value={projectInfo.title}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="description" value="Description" />
          <Textarea
            id="description"
            name="description"
            value={projectInfo.description}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="motivation" value="Motivation" />
          <Textarea
            id="motivation"
            name="motivation"
            value={projectInfo.motivation}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="status" value="Status" />
          <Select
            id="status"
            name="status"
            value={projectInfo.status}
            onChange={(e) => handleDropdownChange("status", e.target.value)}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxUsers" value="Max Users" />
          <TextInput
            id="maxUsers"
            type="number"
            name="maxUsers"
            value={projectInfo.maxUsers}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="startingDate" value="Starting Date" />
          <TextInput
            id="startingDate"
            type="date"
            name="startingDate"
            value={projectInfo.startingDate}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="plannedEndDate" value="Planned End Date" />
          <TextInput
            id="plannedEndDate"
            type="date"
            name="plannedEndDate"
            value={projectInfo.plannedEndDate}
            onChange={handleChange}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        {/* Skills */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value="Skills" />
            <div className="inline-flex items-center cursor-pointer" id="icon-element" onClick={openPopUpSkills}>
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div className="inline-flex items-center cursor-pointer" id="icon-element-remove" onClick={openPopUpSkillsRemove}>
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element"
              content="Add new skill"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove"
              content="Remove a skill"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.skills)
                ? projectInfo.skills.map((skill) => skill.name).join(", ")
                : ""}
            </p>
          </div>
        </div>
        {/* Interests */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="interests" value="Interests" />
            <div className="inline-flex items-center cursor-pointer" id="icon-element-interests" onClick={openPopUpInterests}>
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div className="inline-flex items-center cursor-pointer" id="icon-element-remove-interest" onClick={openPopUpInterestRemove}>
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element-interests"
              content="Add new interest"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove-interest"
              content="Remove an interest"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.interests)
                ? projectInfo.interests.map((interest) => interest.name).join(", ")
                : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>Create Project</Button>
      </div>
    </Card>
  );
}

export default ProjectCard;

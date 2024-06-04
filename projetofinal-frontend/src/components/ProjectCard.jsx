import React from "react";
import { Card, TextInput, Label, Button, Select, Textarea } from "flowbite-react";
import { Tooltip } from "react-tooltip";
import useProjectInfo from "../Hooks/useProjectInfo";
import { createProject } from "../Services/projectService";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";

function ProjectCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove
}) {
  const { projectInfo, handleChange, handleDropdownChange } = useProjectInfo();

  const handleSubmit = async () => {
    try {
      const newProject = await createProject(projectInfo);
      if (newProject) {
        console.log("Project created successfully");
        openPopUpSkills(newProject.id);
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
        {/* Form fields for project information */}
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput id="title" type="text" name="title" value={projectInfo.title} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="description" value="Description" />
          <Textarea id="description" name="description" value={projectInfo.description} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="motivation" value="Motivation" />
          <Textarea id="motivation" name="motivation" value={projectInfo.motivation} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="status" value="Status" />
          <Select id="status" name="status" value={projectInfo.status} onChange={(e) => handleDropdownChange("status", e.target.value)}>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxUsers" value="Max Users" />
          <TextInput id="maxUsers" type="number" name="maxUsers" value={projectInfo.maxUsers} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="startingDate" value="Starting Date" />
          <TextInput id="startingDate" type="date" name="startingDate" value={projectInfo.startingDate} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="plannedEndDate" value="Planned End Date" />
          <TextInput id="plannedEndDate" type="date" name="plannedEndDate" value={projectInfo.plannedEndDate} onChange={handleChange} />
        </div>
        {/* Skills */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value="Skills" />
            <div className="inline-flex items-center cursor-pointer" id="icon-element2" onClick={() => openPopUpSkills("project")}>
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div className="inline-flex items-center cursor-pointer" id="icon-element-remove2" onClick={() => openPopUpSkillsRemove("project")}>
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip anchorSelect="#icon-element2" content="Add new skill" place="top" />
            <Tooltip anchorSelect="#icon-element-remove2" content="Remove a skill" place="top" />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.skills)
                ? projectInfo.skills.slice(0, 3).map((skill) => skill.name).join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.skills) && projectInfo.skills.length > 3 && (
              <div id="tip-all-skills">
                <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                  {`+${projectInfo.skills.length - 3}`}
                </button>
                <Tooltip
                  anchorSelect="#tip-all-skills"
                  content="Check all skills"
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        {/* Interests */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="interests" value="Interests" />
            <div className="inline-flex items-center cursor-pointer" id="icon-element4" onClick={() => openPopUpInterests("project")}>
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div className="inline-flex items-center cursor-pointer" id="icon-element-remove4" onClick={() => openPopUpInterestRemove("project")}>
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip anchorSelect="#icon-element4" content="Add new interest" place="top" />
            <Tooltip anchorSelect="#icon-element-remove4" content="Remove an interest" place="top" />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.interests)
                ? projectInfo.interests.slice(0, 3).map((interest) => interest.name).join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.interests) && projectInfo.interests.length > 3 && (
              <div id="tip-all-interests">
                <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                  {`+${projectInfo.interests.length - 3}`}
                </button>
                <Tooltip
                  anchorSelect="#tip-all-interests"
                  content="Check all interests"
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        {/* Save Button */}
        <div className="col-span-3 mt-6 flex justify-end">
          <Button color="primary" onClick={handleSubmit}>
            Save Project
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;

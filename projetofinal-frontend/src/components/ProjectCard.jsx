import {
  Card,
  TextInput,
  Label,
  Button,
  Textarea,
  Select,
} from "flowbite-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { createProject } from "../Services/projectService";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import useUserStore from "../Stores/UserStore";

function ProjectCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove,
  openPopUpComponent,
  openPopUpComponentsRemove,
  openPopUpResources,
  openPopUpResourcesRemove,
  openPopUpUsers,
  openPopUpUsersRemove,
  projectInfo,
  handleChange,
  handleWorkplaceChange,
}) {

  const { workplaces } = useWorkplaceStore();
  const [selectedWorkLocation, setSelectedWorkLocation] = useState("");

  console.log(workplaces);

  const formatDateForBackend = (dateString) => {
    if (!dateString) {
      return null; // Handle the case where dateString is null or undefined
    }

    // Append the time part to the date string
    const formattedDate = `${dateString} 00:00:00`;

    return formattedDate;
  };

  const token = useUserStore((state) => state.token);

  const handleSubmit = async () => {
    const formattedProjectInfo = {
      ...projectInfo,
      startingDate: formatDateForBackend(projectInfo.startingDate),
      plannedEndDate: formatDateForBackend(projectInfo.plannedEndDate),
      workplace: JSON.parse(selectedWorkLocation),
    };

    console.log("Formatted project info:", formattedProjectInfo);

    try {
      const newProject = await createProject(formattedProjectInfo, token);
      if (newProject) {
        console.log("Project created successfully");
      } else {
        console.error("Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Card className="border-gray-600 bg-gradient-to-r from-gray-400 via-gray-75 to-white rounded-lg shadow-md w-3/4 h-auto mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">New Project</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput
            id="title"
            type="text"
            name="title"
            value={projectInfo.title}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <Label htmlFor="description" value="Description" />
          <Textarea
            id="description"
            name="description"
            value={projectInfo.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="motivation" value="Motivation" />
          <Textarea
            id="motivation"
            name="motivation"
            value={projectInfo.motivation}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="maxUsers" value="Max Users" />
          <TextInput
            id="maxUsers"
            type="number"
            name="maxUsers"
            value={projectInfo.maxUsers}
            min={0}
            max={10}
            onChange={(e) => {
              const value = Math.max(0, Math.min(10, e.target.value));
              handleChange({
                target: {
                  name: "maxUsers",
                  value,
                },
              });
            }}
          />
        </div>

        <div>
          <Label htmlFor="workplace" value="Workplace" />
          <Select
            id="workplace"
            name="workplace"
            value={JSON.stringify(projectInfo.workplace)}
            onChange={(e) => {
              setSelectedWorkLocation(e.target.value);
              handleWorkplaceChange(e);
            }}
            className="w-1/2"
          >
            <option value={JSON.stringify({ id: null, name: "" })} disabled>
              Select Workplace
            </option>
            {workplaces.map((location) => (
              <option key={location.id} value={JSON.stringify(location)}>
                {location.name}
              </option>
            ))}
          </Select>
        </div>
        {/* Skills */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value="Skills" />
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element2"
              onClick={openPopUpSkills}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element-remove2"
              onClick={openPopUpSkillsRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element2"
              content="Add new skill"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove2"
              content="Remove a skill"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.skills)
                ? projectInfo.skills
                    .slice(0, 3)
                    .map((skill) => skill.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.skills) &&
              projectInfo.skills.length > 3 && (
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
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element4"
              onClick={openPopUpInterests}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element-remove4"
              onClick={openPopUpInterestRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element4"
              content="Add new interest"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove4"
              content="Remove an interest"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.interests)
                ? projectInfo.interests
                    .slice(0, 3)
                    .map((interest) => interest.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.interests) &&
              projectInfo.interests.length > 3 && (
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
        {/* Components */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="components" value="Components" />
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element5"
              onClick={openPopUpComponent}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element-remove5"
              onClick={openPopUpComponentsRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element5"
              content="Add new component"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove5"
              content="Remove a component"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.components)
                ? projectInfo.components
                    .slice(0, 3)
                    .map((component) => component.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.components) &&
              projectInfo.components.length > 3 && (
                <div id="tip-all-components">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectInfo.components.length - 3}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-components"
                    content="Check all components"
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Resources */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="resources" value="Resources" />
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element6"
              onClick={openPopUpResources}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element-remove6"
              onClick={openPopUpResourcesRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element6"
              content="Add new resource"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove6"
              content="Remove a resource"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.resources)
                ? projectInfo.resources
                    .slice(0, 3)
                    .map((resource) => resource.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.resources) &&
              projectInfo.resources.length > 3 && (
                <div id="tip-all-resources">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectInfo.resources.length - 3}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-resources"
                    content="Check all resources"
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Team */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="team" value="Team" />
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element7"
              onClick={openPopUpUsers}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              className="inline-flex items-center cursor-pointer"
              id="icon-element-remove7"
              onClick={openPopUpUsersRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element7"
              content="Add new user"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove7"
              content="Remove a user"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectInfo.userProjectDtos)
                ? projectInfo.userProjectDtos
                    .slice(0, 3)
                    .map((user) => user.username)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectInfo.userProjectDtos) &&
              projectInfo.userProjectDtos.length > 3 && (
                <div id="tip-all-users">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectInfo.userProjectDtos.length - 3}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-users"
                    content="Check all users"
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
      </div>
      <Button onClick={handleSubmit} className="mt-4 mx-auto">
        Create Project
      </Button>
    </Card>
  );
}

export default ProjectCard;

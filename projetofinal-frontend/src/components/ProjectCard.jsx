import {
  Card,
  TextInput,
  Label,
  Button,
  Textarea,
  Select,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { createProject } from "../Services/projectService";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import useUserStore from "../Stores/UserStore";
import { FaStarOfLife } from "react-icons/fa";
import useProjectStore from "../Stores/ProjectStore.js";
import {useTranslation} from "react-i18next";

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
  const [successMessage, setSuccessMessage] = useState("");

  const clearAllProjectDetails = useProjectStore(
    (state) => state.clearAllProjectDetails
  );
  const {t} = useTranslation();

  useEffect(() => {
    clearAllProjectDetails();
  }, []);

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
    const requiredFields = [
      "title",
      "startingDate",
      "plannedEndDate",
      "workplace",
      "description",
      "interests",
    ];

    const isFormValid = requiredFields.every((field) => {
      if (field === "workplace") {
        return selectedWorkLocation !== "";
      }
      if (field === "interests") {
        return (
          Array.isArray(projectInfo.interests) &&
          projectInfo.interests.length > 0
        );
      }
      return projectInfo[field];
    });

    if (!isFormValid) {
      alert("Please fill in all mandatory fields.");
      return;
    }

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
        setSuccessMessage(true);
        setSelectedWorkLocation("");
        clearAllProjectDetails();
        handleChange({
          target: { name: "userProjectDtos", value: [] },
        });
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Card className="border-gray-600 bg-gradient-to-r from-gray-400 via-gray-75 to-white rounded-lg shadow-md w-3/4 h-auto mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">New Project</h1>
      <div className="grid grid-cols-3 gap-10 p-4">
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="title"
              value={t("Title")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="title"
            type="text"
            name="title"
            value={projectInfo.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="startingDate"
              value={t("StartingDate")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="startingDate"
            type="date"
            name="startingDate"
            value={projectInfo.startingDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="plannedEndDate"
              value={t("PlannedEndDate")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="plannedEndDate"
            type="date"
            name="plannedEndDate"
            value={projectInfo.plannedEndDate}
            onChange={handleChange}
          />
        </div>
        <div className="w-2/3">
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="workplace"
              value={t("Workplace")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <Select
            id="workplace"
            name="workplace"
            value={JSON.stringify(projectInfo.workplace)}
            onChange={(e) => {
              setSelectedWorkLocation(e.target.value);
              handleWorkplaceChange(e);
            }}
          >
            <option value={JSON.stringify({ id: null, name: "" })} disabled>
              {t("SelectWorkplace")}
            </option>
            {workplaces.map((location) => (
              <option key={location.id} value={JSON.stringify(location)}>
                {location.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-2/3">
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="maxUsers"
              value={t("MaxUsers")}
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="maxUsers"
            type="number"
            name="maxUsers"
            value={projectInfo.maxUsers}
            min={1}
            max={4}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "maxUsers",
                  value: e.target.value,
                },
              });
            }}
          />
        </div>
        {/* Team */}
        <div className="mt-4">
          <div className="flex items-center">
            <div className="mb-2 flex items-center -mt-4">
              <Label
                htmlFor="team"
                value={t("Team")}
                className="font-semibold text-base"
              />
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
                content={t("AddNewUser")}
                place="top"
              />
              <Tooltip
                anchorSelect="#icon-element-remove7"
                content={t("RemoveUser")}
                place="top"
              />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
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
                    content={t("CheckAllUsers")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Skills */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label
              htmlFor="skills"
              value={t("Skills")}
              className="font-semibold text-base"
            />
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
              content={t("AddNewSkill")}
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove2"
              content={t("RemoveSkill")}
              place="top"
            />
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
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
                    content={t("CheckAllSkills")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Interests */}
        <div className="mt-4">
          <div className="flex items-center">
            <div className=" flex items-center">
              <Label
                htmlFor="interests"
                value={t("Interests")}
                className="font-semibold text-base"
              />
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
                content={t("AddNewInterest")}
                place="top"
              />
              <Tooltip
                anchorSelect="#icon-element-remove4"
                content={t("RemoveInterest")}
                place="top"
              />
              <FaStarOfLife className="text-red-500 ml-2 text-xs" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
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
                    content={t("CheckAllInterests")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Components */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label
              htmlFor="components"
              value={t("Components")}
              className="font-semibold text-base"
            />
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
              content={t("AddNewComponent")}
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove5"
              content={t("RemoveComponent")}
              place="top"
            />
          </div>
          <div className="flex items-center text-sm mt-2 font-medium text-gray-900 dark:text-gray-400">
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
                    content={t("CheckAllComponents")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {/* Resources */}
        <div className="mt-4">
          <div className="flex items-center">
            <Label
              htmlFor="resources"
              value={t("Resources")}
              className="font-semibold text-base"
            />
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
              content={t("AddNewResource")}
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove6"
              content={t("RemoveResource")}
              place="top"
            />
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
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
                    content={t("CheckAllResources")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="description"
              value={t("Description")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <Textarea
            id="description"
            name="description"
            value={projectInfo.description}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="motivation"
              value={t("Motivation")}
              className="font-semibold text-base"
            />
          </div>
          <Textarea
            id="motivation"
            name="motivation"
            value={projectInfo.motivation}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-2 ml-4 flex items-center col-span-full">
        <FaStarOfLife className="text-red-500 mr-2 text-xs" />
        <Label
          htmlFor="warning"
          value={t("MandatoryFields")}
        />
      </div>
      {successMessage === true && (
        <div className="mb-2 ml-4 flex items-center col-span-full">
          <Label
            htmlFor="success"
            value={t("ProjectCreatedSuccessfully")}
            className="mb-2 text-green-700"
          />
        </div>
      )}
      <Button onClick={handleSubmit} className="mt-4 mx-auto">
        {t("CreateProject")}
      </Button>
    </Card>
  );
}

export default ProjectCard;

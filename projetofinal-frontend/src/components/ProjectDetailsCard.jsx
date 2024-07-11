import React, { useState, useEffect } from "react";
import {
  Card,
  TextInput,
  Label,
  Button,
  Select,
  Textarea,
} from "flowbite-react";
import { MdOutlineEdit } from "react-icons/md";
import { LuBadge, LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TeamCard from "./TeamCard";
import { useTranslation } from "react-i18next";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ProjectDetailsCard({
  project,
  userImages,
  openPopUpUsers,
  openPopUpSkills,
  openPopUpSkillsRemove,
  openPopUpInterests,
  openPopUpInterestRemove,
  openPopUpComponent,
  openPopUpComponentsRemove,
  openPopUpResources,
  openPopUpResourcesRemove,
  fetchProjectDetails,
}) {
  const { projectId } = useParams(); //obter o id do projeto através do url
  const { t } = useTranslation(); //função de tradução
  const [editMode, setEditMode] = useState(false); //estado para editar o projeto
  const [projectDetails, setProjectDetails] = useState({ ...project }); //detalhes do projeto
  const apiUrl = useApiStore((state) => state.apiUrl); //URL da API
  const token = useUserStore((state) => state.token); //token do utilizador
  const workplaces = useWorkplaceStore((state) => state.workplaces); //locais de trabalho
  const navigate = useNavigate(); //navegar para outra página
  const handleSessionTimeout = () => {
    //função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };
  let currentUserId;

  if (token) {
    const decodedToken = jwtDecode(token); //decodificar o token
    currentUserId = decodedToken.id; //id do utilizador
  }

  const currentUserIsAdmin = projectDetails.userProjectDtos?.some(
    //verificar se o utilizador é administrador
    (user) => user.userId === currentUserId && user.admin
  );

  const statusOptions = [
    //opções de estado
    ...(projectDetails.status === 100
      ? [
          { value: 100, label: "PLANNING" },
          { value: 200, label: "READY" },
          { value: 500, label: "CANCELLED" },
        ]
      : []),
    ...(projectDetails.status === 200
      ? [
          { value: 100, label: "PLANNING" },
          { value: 200, label: "READY" },
          { value: 500, label: "CANCELLED" },
        ]
      : []),
    ...(projectDetails.status === 300
      ? [
          { value: 300, label: "IN PROGRESS" },
          { value: 400, label: "FINISHED" },
          { value: 500, label: "CANCELLED" },
        ]
      : []),
    ...(projectDetails.status === 400
      ? [{ value: 400, label: "FINISHED" }]
      : []),
    ...(projectDetails.status === 500
      ? [{ value: 500, label: "CANCELLED" }]
      : []),
  ];

  const handleChange = (e) => {
    //função para lidar com a mudança
    const { name, value } = e.target;
    if (name === "workplace") {
      const selectedWorkplace = workplaces.find(
        (wp) => wp.id === parseInt(value, 10)
      );
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        workplace: selectedWorkplace || { id: null, name: "" },
      }));
    } else if (name === "status") {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        status: parseInt(value, 10),
      }));
    } else if (name === "startingDate" || name === "plannedEndDate") {
      const dateArray = convertDateToArray(value);
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        [name]: dateArray,
      }));
      console.log(projectDetails);
    } else {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const formatDateForBackend = (dateArray) => {
    //formatar a data para o backend
    if (!dateArray || dateArray.length !== 5) {
      return null;
    }

    const [year, month, day, hours, minutes] = dateArray;

    const formattedMonth = `${month}`.padStart(2, "0");
    const formattedHours = `${hours}`.padStart(2, "0");
    const formattedDay = `${day}`.padStart(2, "0");

    const formattedDate = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${minutes}0:00`;

    return formattedDate;
  };

  const convertDateToArray = (dateString) => {
    //converter a data para um array
    console.log(dateString);
    const date = new Date(dateString);
    console.log(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day, 10, 0];
  };

  const handleSaveClick = async () => {
    //função para lidar com o clique no botão de guardar
    const updatedProjectDetails = {
      title: projectDetails.title,
      status: projectDetails.status,
      description: projectDetails.description,
      motivation: projectDetails.motivation,
      startingDate: formatDateForBackend(projectDetails.startingDate),
      plannedEndDate: formatDateForBackend(projectDetails.plannedEndDate),
      workplace: projectDetails.workplace,
      maxUsers: projectDetails.maxUsers,
    };

    try {
      console.log(updatedProjectDetails);
      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        //atualizar os detalhes do projeto
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProjectDetails),
      });

      if (response.status === 200) {
        //se a resposta for 200
        setEditMode(false);
        fetchProjectDetails();
      } else if (response.status === 401) {
        //se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          //se a mensagem de erro for "Invalid token"
          handleSessionTimeout();
          return;
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error updating project details");
      }
    } catch (error) {
      console.error("Error updating project details:", error);
    }
  };

  const handleAdminChange = async (userId, isAdmin) => {
    //função para alterar o administrador
    try {
      const response = await fetch(
        `${apiUrl}/projects/${projectId}/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAdmin }),
        }
      );

      if (response.status === 200) {
        //se a resposta for 200
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          userProjectDtos: prevDetails.userProjectDtos.map((user) =>
            user.userId === userId ? { ...user, admin: isAdmin } : user
          ),
        }));
      } else if (response.status === 401) {
        //se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // sessão terminada
          return;
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error updating user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserDeactivation = async (userId) => {
    //função para desativar o utilizador
    try {
      const response = await fetch(
        `${apiUrl}/projects/${projectId}/users/${userId}/inactive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: false }),
        }
      );

      if (response.status === 200) {
        //se a resposta for 200
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          userProjectDtos: prevDetails.userProjectDtos.map((user) =>
            user.userId === userId ? { ...user, active: false } : user
          ),
        }));
      } else if (response.status === 401) {
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // sessão terminada
          return;
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error deactivating user");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleCancelClick = () => {
    //função para lidar com o clique no botão de cancelar
    setProjectDetails({ ...project });
    setEditMode(false);
  };

  useEffect(() => {
    setProjectDetails({ ...project });
  }, [project]);

  const formatDateForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }

    const [year, month, day] = dateArray;
    const date = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
    const isoString = date.toISOString();

    return isoString.split("T")[0]; // Return YYYY-MM-DD format
  };

  const getBadge = (approved) => {
    //obter o crachá
    if (approved === true) {
      return (
        <>
          <LuBadgeCheck
            id="badge-approved"
            className="h-6 w-6 text-white bg-green-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-approved"
            content="Approved"
            place="top"
          />
        </>
      );
    } else if (approved === false) {
      return (
        <>
          <LuBadgeX
            id="badge-not-approved"
            className="h-6 w-6 text-white bg-red-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-not-approved"
            content="Not Approved"
            place="top"
          />
        </>
      );
    } else {
      return (
        <>
          <LuBadge
            id="badge-under-planning"
            className="h-6 w-6 text-white bg-gray-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-under-planning"
            content="Under Planning"
            place="top"
          />
        </>
      );
    }
  };

  return (
    <div>
      <Card className="bg-gray-200 transition-colors duration-200 h-auto">
        <div className="flex flex-col pb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">{projectDetails.title}</h2>
              {getBadge(projectDetails.approved)}
            </div>
            <div className="flex items-center space-x-2">
              {currentUserIsAdmin &&
                (projectDetails.status === 100 ||
                  projectDetails.status === 300) && (
                  <MdOutlineEdit
                    className="h-6 w-6 text-black cursor-pointer"
                    onClick={() => setEditMode(true)}
                  />
                )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title" value="Title" />
              {editMode ? (
                <TextInput
                  id="title"
                  type="text"
                  name="title"
                  value={projectDetails.title}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projectDetails.title}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="status" value="Status" />
              {editMode ? (
                <Select
                  id="status"
                  name="status"
                  value={projectDetails.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {
                    statusOptions.find(
                      (option) => option.value === projectDetails.status
                    )?.label
                  }
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description" value="Description" />
              {editMode ? (
                <Textarea
                  id="description"
                  name="description"
                  value={projectDetails.description}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projectDetails.description}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="motivation" value="Motivation" />
              {editMode ? (
                <Textarea
                  id="motivation"
                  name="motivation"
                  value={projectDetails.motivation}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projectDetails.motivation}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="startingDate" value="Starting Date" />
              {editMode ? (
                <TextInput
                  id="startingDate"
                  type="date"
                  name="startingDate"
                  value={formatDateForInput(projectDetails.startingDate)}
                  onChange={handleChange}
                  className="w-1/2"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDateForInput(projectDetails.startingDate)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="plannedEndDate" value="Planned End Date" />
              {editMode ? (
                <TextInput
                  id="plannedEndDate"
                  type="date"
                  name="plannedEndDate"
                  value={formatDateForInput(projectDetails.plannedEndDate)}
                  onChange={handleChange}
                  className="w-1/2"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDateForInput(projectDetails.plannedEndDate)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="workplace" value="Workplace" />
              {editMode ? (
                <Select
                  id="workplace"
                  name="workplace"
                  value={projectDetails.workplace?.id || ""}
                  onChange={handleChange}
                  className="w-1/2"
                >
                  <option value="" disabled>
                    Select Workplace
                  </option>
                  {workplaces.map((workplace) => (
                    <option key={workplace.id} value={workplace.id}>
                      {workplace.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projectDetails.workplace?.name || "No workplace assigned"}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="maxUsers" value="Max Users" />
              {editMode ? (
                <TextInput
                  id="maxUsers"
                  type="number"
                  name="maxUsers"
                  min={1}
                  max={4}
                  value={projectDetails.maxUsers}
                  onChange={handleChange}
                  className="w-1/2"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projectDetails.maxUsers}
                </p>
              )}
            </div>
          </div>
          {editMode && (
            <div className="flex justify-end mt-4 -mb-6">
              <Button onClick={handleCancelClick} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSaveClick}>Save</Button>
            </div>
          )}
        </div>
      </Card>
      <Card className="mt-4">
        <TeamCard
          projectDetails={projectDetails}
          currentUserIsAdmin={currentUserIsAdmin}
          userImages={userImages}
          handleAdminChange={handleAdminChange}
          handleUserDeactivation={handleUserDeactivation}
          currentUserId={currentUserId}
          openPopUpUsers={openPopUpUsers}
        />
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
              {Array.isArray(projectDetails.skills)
                ? projectDetails.skills
                    .slice(0, 3)
                    .map((skill) => skill.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectDetails.skills) &&
              projectDetails.skills.length > 3 && (
                <div id="tip-all-skills">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectDetails.skills.length - 3}`}
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
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            <p>
              {Array.isArray(projectDetails.interests)
                ? projectDetails.interests
                    .slice(0, 3)
                    .map((interest) => interest.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectDetails.interests) &&
              projectDetails.interests.length > 3 && (
                <div id="tip-all-interests">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectDetails.interests.length - 3}`}
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
              {Array.isArray(projectDetails.components)
                ? projectDetails.components
                    .slice(0, 3)
                    .map((component) => component.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectDetails.components) &&
              projectDetails.components.length > 3 && (
                <div id="tip-all-components">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectDetails.components.length - 3}`}
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
              {Array.isArray(projectDetails.resources)
                ? projectDetails.resources
                    .slice(0, 3)
                    .map((resource) => resource.name)
                    .join(", ")
                : ""}
            </p>
            {Array.isArray(projectDetails.resources) &&
              projectDetails.resources.length > 3 && (
                <div id="tip-all-resources">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${projectDetails.resources.length - 3}`}
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
      </Card>
    </div>
  );
}

export default ProjectDetailsCard;

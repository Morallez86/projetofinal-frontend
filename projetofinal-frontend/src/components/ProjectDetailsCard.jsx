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

function ProjectDetailsCard({ project, userImages, openPopUpUsers }) {
  const { projectId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [projectDetails, setProjectDetails] = useState({ ...project });
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const workplaces = useWorkplaceStore((state) => state.workplaces);
  let currentUserId;

  if (token) {
    const decodedToken = jwtDecode(token);
    currentUserId = decodedToken.id;
  }

  const currentUserIsAdmin = projectDetails.userProjectDtos?.some(
    (user) => user.userId === currentUserId && user.admin
  );

  const statusOptions = [
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
    const { name, value } = e.target;
    console.log(value);

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
    } else if (name === "creationDate" || name === "plannedEndDate") {
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
  if (!dateArray || dateArray.length !== 5) {
    return null;
  }

  const [year, month, day, hours, minutes] = dateArray;

  // Ensure month and day are two digits (zero-padded if necessary)
  const formattedMonth = `${month + 1}`.padStart(2, "0"); // Note: month in JavaScript Date object is 0-indexed
  const formattedDay = `${day}`.padStart(2, "0");

  const formattedDate = `${year}-${formattedMonth}-${formattedDay} ${hours}:${minutes}0:00`;

  return formattedDate;
};

  const convertDateToArray = (dateString) => {
    const date = new Date(dateString);
    console.log(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns months from 0-11
    const day = date.getDate();
    return [year, month, day, 10, 0];
  };

  const handleSaveClick = async () => {
    const updatedProjectDetails = {
      title: projectDetails.title,
      status: projectDetails.status,
      description: projectDetails.description,
      motivation: projectDetails.motivation,
      creationDate: formatDateForBackend(projectDetails.creationDate),
      plannedEndDate: formatDateForBackend(projectDetails.plannedEndDate),
      workplace: projectDetails.workplace,
      maxUsers: projectDetails.maxUsers,
    };

    console.log(updatedProjectDetails);

    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProjectDetails),
      });

      if (response.status === 200) {
        console.log("Project details updated successfully");
        setEditMode(false);
      } else {
        console.error("Error updating project details");
      }
    } catch (error) {
      console.error("Error updating project details:", error);
    }
  };

  const handleAdminChange = async (userId, isAdmin) => {
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
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          userProjectDtos: prevDetails.userProjectDtos.map((user) =>
            user.userId === userId ? { ...user, admin: isAdmin } : user
          ),
        }));
        console.log("User status updated successfully");
      } else {
        console.error("Error updating user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserDeactivation = async (userId) => {
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
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          userProjectDtos: prevDetails.userProjectDtos.map((user) =>
            user.userId === userId ? { ...user, active: false } : user
          ),
        }));
        console.log("User deactivated successfully");
      } else {
        console.error("Error deactivating user");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleCancelClick = () => {
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

    const [year, month, day, hour = 0, minute = 0] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    const isoString = date.toISOString();
    return isoString.split("T")[0];
  };

  const getBadge = (approved) => {
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
              {currentUserIsAdmin && (projectDetails.status===100 || projectDetails.status===300) && (
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
              <Label htmlFor="creationDate" value="Creation Date" />
              {editMode ? (
                <TextInput
                  id="creationDate"
                  type="date"
                  name="creationDate"
                  value={formatDateForInput(projectDetails.creationDate)}
                  onChange={handleChange}
                  className="w-1/2"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDateForInput(projectDetails.creationDate)}
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
      </Card>
    </div>
  );
}

export default ProjectDetailsCard;

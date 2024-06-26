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
import basePhoto from "../Assets/092.png";

function ProjectDetailsCard({ project, userImages }) {
  const { projectId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [projectDetails, setProjectDetails] = useState({ ...project });
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const workplaces = useWorkplaceStore((state) => state.workplaces);

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
      ? [
          { value: 500, label: "CANCELLED" },
        ]
      : []),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for workplace
    if (name === "workplace") {
      const selectedWorkplace = workplaces.find(
        (wp) => wp.id === parseInt(value, 10)
      );
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        workplace: selectedWorkplace || { id: null, name: "" },
      }));
    } else if (name === "status") {
      // Handle status change
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        status: parseInt(value, 10), // Ensure value is parsed to integer
      }));
    } else {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSaveClick = async () => {
    console.log(projectDetails)
    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectDetails),
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
    return new Date(year, month - 1, day, hour, minute)
      .toISOString()
      .split("T")[0];
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
    <Card className="bg-gray-200 transition-colors duration-200 h-auto">
      <div className="flex flex-col pb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{projectDetails.title}</h2>
            {getBadge(projectDetails.approved)}
          </div>
          <div className="flex items-center space-x-2">
            <MdOutlineEdit
              className="h-6 w-6 text-black cursor-pointer"
              onClick={() => setEditMode(true)}
            />
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
          <div>
            <Label htmlFor="Team" value="Team" />
            {project.userProjectDtos?.map((up) => (
              <div key={up.userId} className="flex items-center mb-2">
                {userImages[up.userId] ? (
                  <img
                    src={`data:${userImages[up.userId].type};base64,${
                      userImages[up.userId].image
                    }`}
                    alt={`${up.username}'s profile`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <img
                    src={basePhoto}
                    alt="Placeholder"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span>{up.username}</span>
              </div>
            ))}
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleCancelClick} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>Save</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProjectDetailsCard;

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
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useParams } from "react-router-dom";

function ProjectDetailsCard({ project }) {
  const { projectId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [projectDetails, setProjectDetails] = useState({ ...project });
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);

  const statusOptions = [
    { value: 100, label: "PLANNING" },
    { value: 200, label: "READY" },
    { value: 300, label: "IN PROGRESS" },
    { value: 400, label: "FINISHED" },
    { value: 500, label: "CANCELLED" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
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

  return (
    <Card className="bg-gray-200 transition-colors duration-200 h-auto">
      <div className="flex flex-col pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{projectDetails.title}</h2>
          <MdOutlineEdit
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => setEditMode(true)}
          />
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
            <Label htmlFor="plannedEndDate" value="Planned End Date" />
            {editMode ? (
              <TextInput
                id="plannedEndDate"
                type="date"
                name="plannedEndDate"
                value={formatDateForInput(projectDetails.plannedEndDate)}
                onChange={handleChange}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateForInput(projectDetails.plannedEndDate)}
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
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateForInput(projectDetails.creationDate)}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="approved" value="Approved" />
            {editMode ? (
              <Select
                id="approved"
                name="approved"
                value={projectDetails.approved.toString()}
                onChange={handleChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {projectDetails.approved ? "Yes" : "No"}
              </p>
            )}
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

import React, { useState } from "react";
import Layout from "../Components/Layout";
import {
  Card,
  TextInput,
  Label,
  Button,
  Select,
  Dropdown,
  Datepicker,
  Textarea,
} from "flowbite-react";
import useApiStore from '../Stores/ApiStore';

function AllProjectsCreateNew() {
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
    <div className="flex flex-col min-h-screen">
    <Layout activeTab={1} activeSubProjects={0}/>
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
              onChange={(e) => handleDropdownChange('status', e.target.value)}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
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
            <Datepicker
              id="startingDate"
              name="startingDate"
              selected={projectInfo.startingDate}
              onChange={(date) => handleDropdownChange('startingDate', date)}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="plannedEndDate" value="Planned End Date" />
            <Datepicker
              id="plannedEndDate"
              name="plannedEndDate"
              selected={projectInfo.plannedEndDate}
              onChange={(date) => handleDropdownChange('plannedEndDate', date)}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="components" value="Components" />
            <Dropdown
              label="Select Components"
              dismissOnClick={false}
              className="w-full"
            >
            </Dropdown>
          </div>
          <div>
            <Label htmlFor="resources" value="Resources" />
            <Dropdown
              label="Select Resources"
              dismissOnClick={false}
              className="w-full"
            >
            </Dropdown>
          </div>
          <div>
            <Label htmlFor="interests" value="Interests" />
            <Dropdown
              label="Select Interests"
              dismissOnClick={false}
              className="w-full"
            >
            </Dropdown>
          </div>
          <div>
            <Label htmlFor="skills" value="Skills" />
            <Dropdown
              label="Select Skills"
              dismissOnClick={false}
              className="w-full"
            >
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Create Project</Button>
        </div>
      </Card>
      </div>
  );
}

export default AllProjectsCreateNew;

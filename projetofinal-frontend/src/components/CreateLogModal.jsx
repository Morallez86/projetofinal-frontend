import React from "react";
import { Modal, Label, Textarea, Button } from "flowbite-react";
import Select from "react-select";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";

function CreateLogModal({ onClose, tasks, projectId }) {
  const options = tasks.map((task) => ({ value: task.id, label: task.title }));
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);

  let userIdFromToken;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userIdFromToken = decodedToken.id;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const [formData, setFormData] = useState({
    newDescription: "",
    type: "",
    timestamp: "",
    userId: userIdFromToken,
    projectId: projectId,
    taskId: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addLog = async () => {
    try {
      const response = await fetch(`${apiUrl}/projectHistory/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create log");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to create log", error);
    }
  };

  const handleSubmit = () => {
    addLog();
    console.log(formData);
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>Create Log</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 items-start justify-center h-[16rem] overflow-auto">
          <div className="mt-4">
            <Label htmlFor="description" value="About log" />
            <Textarea
              id="description"
              name="newDescription"
              className="h-[10rem] resize-none"
              defaultValue={""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="task" value="Associate to a task" />
            <Select
              options={options}
              placeholder="Select task name"
              maxMenuHeight={160}
              onChange={(selectedOption) =>
                setFormData((prevData) => ({
                  ...prevData,
                  taskId: selectedOption.value,
                }))
              }
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray">Cancel</Button>
        <Button color="gray" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateLogModal;

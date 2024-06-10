import React from "react";
import { Modal, Label, Textarea, Button } from "flowbite-react";
import Select from "react-select";
import { useState } from "react";

function CreateLogModal({ onClose, tasks }) {
  const options = tasks.map((task) => ({ value: task.id, label: task.title }));

  const [formData, setFormData] = useState({
    newDescription: "",
    type: "",
    timestamp: "",
    userId: "",
    projectId: "",
    taskId: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
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
              name="description"
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

import React from "react";
import { Modal, Label, Textarea, Dropdown, Button } from "flowbite-react";
import Select from "react-select";

function CreateLogModal({ onClose, tasks }) {
  const options = tasks.map((task) => ({ value: task.id, label: task.title }));

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>Create Log</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 items-center justify-center">
          <div className="mt-4">
            <Label htmlFor="description" value="About log" />
            <Textarea id="description" name="description" />
          </div>
          <div className="mt-4">
            <Label htmlFor="task" value="Associate to a task" />
            <Select
              options={options}
              /*onChange={handleSelectChange}
                onInputChange={handleInputChange}
                */
              placeholder="Select task name"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray">Cancel</Button>
        <Button color="gray">Create</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateLogModal;

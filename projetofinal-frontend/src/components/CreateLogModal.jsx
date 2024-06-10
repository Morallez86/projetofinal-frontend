import React from "react";
import { Modal, Label, Textarea, Dropdown, Button } from "flowbite-react";
import Select from "react-select";

function CreateLogModal({ onClose, tasks }) {
  const options = tasks.map((task) => ({ value: task.id, label: task.title }));

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
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="task" value="Associate to a task" />
            <Select
              options={options}
              /*onChange={handleSelectChange}
                onInputChange={handleInputChange}
                */
              placeholder="Select task name"
              maxMenuHeight={160} // Assuming each option has a height of 40px
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

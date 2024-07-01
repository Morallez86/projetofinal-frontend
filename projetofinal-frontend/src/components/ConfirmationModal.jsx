// Components/ConfirmationModal.jsx
import React from "react";
import { Modal, Button } from "flowbite-react";

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            Confirmation
          </h3>
          <p>{message}</p>
          <div className="flex space-x-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;

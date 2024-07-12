// Components/ConfirmationModal.jsx
import React from "react";
import { Modal, Button } from "flowbite-react";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  const { t } = useTranslation(); // Função de tradução

  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("Confirmation")}
          </h3>
          <p>{message}</p>
          <div className="flex space-x-4">
            <Button color="gray" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button onClick={onConfirm}>{t("Confirm")}</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;

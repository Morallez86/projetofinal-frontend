import React from "react";
import { Modal, Label, Textarea, Button, Alert } from "flowbite-react";
import Select from "react-select";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CreateLogModal({ onClose, tasks, projectId, addNewLog }) {
  const options = [
    // Opções para o select
    { value: null, label: "None" },
    ...tasks.map((task) => ({ value: task.id, label: task.title })),
  ];
  const { t } = useTranslation(); // Função de tradução
  const token = useUserStore((state) => state.token); // obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // obter o URL da API
  const [warning, setWarning] = useState(0); // Aviso
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Redirecionar para a página inicial
  };

  let userIdFromToken; // ID do utilizador

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decodificar o token
      userIdFromToken = decodedToken.id; // Obter o ID do utilizador
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const [formData, setFormData] = useState({
    // Dados do formulário
    newDescription: "",
    type: "",
    timestamp: "",
    userId: userIdFromToken,
    projectId: projectId,
    taskId: "",
  });

  const handleChange = (event) => {
    // Função para lidar com a mudança de valor
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addLog = async () => {
    // Função para adicionar um log
    if (formData.newDescription === "") {
      // Verificar se a descrição está vazia
      setWarning(1);
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/projectHistory/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        // Verificar se o utilizador não está autorizado
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Session timeout
          return; // Exit early if session timeout
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }
      if (!response.ok) {
        // Verificar se a resposta não é bem sucedida
        throw new Error("Failed to create log");
      }

      const data = await response.json();

      addNewLog(data); // Adicionar o novo log
      setWarning(0); // Reset warning
      onClose(); // Fechar o modal
    } catch (error) {
      console.error("Failed to create log", error);
    }
  };

  const handleSubmit = () => {
    addLog();
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>{t("Create Log")}</Modal.Header>
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
        {warning === 1 && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">
              {t("Description is necessary for the log")}
            </span>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          onClick={() => {
            setWarning(0);
            onClose();
          }}
        >
          {t("Cancel")}
        </Button>
        <Button color="gray" onClick={handleSubmit}>
          {t("Create")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateLogModal;

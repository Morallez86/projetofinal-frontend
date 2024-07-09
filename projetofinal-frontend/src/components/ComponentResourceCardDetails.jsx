import React, { useState } from "react";
import { Label, Modal, Button, TextInput, Textarea } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ComponentResourceCardDetails({ data, context, onClose }) {
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const { t } = useTranslation(); // Função de tradução
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Redirecionar para a página inicial
  };

  const [formData, setFormData] = useState({ // Dados do formulário
    id: data.id || "",
    name: data.name || "",
    description: data.description || "",
    brand: data.brand || "",
    supplier: data.supplier || "",
    identifier: data.identifier || "",
    contact: data.contact || "",
    observation: data.observation || "",
    ...(context === "resources" && { projectNames: data.projectNames || [] }),
    ...data,
  });

  const handleChange = (e) => { // Função para lidar com a mudança de valores
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSave = async () => { // Função para guardar os dados
    const endpoint = context === "resources" ? "/resources" : "/components"; //É um componente reutiliável
    const method = formData.id ? "PUT" : "POST";
    const url = `${apiUrl}${endpoint}`;
    

    const payload = { ...formData }; // Dados a enviar
    if (context !== "resources") {
      delete payload.projectNames;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) { // Se a resposta for bem-sucedida
        alert(
          `${context === "resources" ? "Resource" : "Component"} ${
            formData.id ? "updated" : "created"
          } successfully`
        );
        onClose();
      } else if (response.status === 401) { // Se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error(
        `Error ${formData.id ? "updating" : "creating"} ${ 
          context === "resources" ? "resource" : "component" 
        }:`,
        error
      );
      alert(
        `An error occurred while ${formData.id ? "updating" : "creating"} the ${
          context === "resources" ? "resource" : "component"
        }`
      );
    }
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>
        {context === "resources"
          ? t("ResourceInformation")
          : t("ComponentInformation")}
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 items-center justify-center">
          <div className="-mt-8">
            <Label
              htmlFor="name"
              value={t("Name")}
              className="font-semibold text-base"
            />
            <TextInput
              id="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              htmlFor="description"
              value={t("Description")}
              className="font-semibold text-base"
            />
            <Textarea
              id="description"
              value={formData.description || ""}
              rows={3}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Label
              htmlFor="brand"
              value={t("Brand")}
              className="font-semibold text-base"
            />
            <TextInput
              id="brand"
              value={formData.brand || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Label
              htmlFor="supplier"
              value={t("Supplier")}
              className="font-semibold text-base"
            />
            <TextInput
              id="supplier"
              value={formData.supplier || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Label
              htmlFor="identifier"
              value={t("Identifier")}
              className="font-semibold text-base"
            />
            <TextInput
              id="identifier"
              value={formData.identifier || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Label
              htmlFor="contact"
              value={t("Contact")}
              className="font-semibold text-base"
            />
            <TextInput
              id="contact"
              value={formData.contact || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 mb-4">
            <Label
              htmlFor="observation"
              value={t("Observation")}
              className="font-semibold text-base"
            />
            <Textarea
              id="observation"
              value={formData.observation || ""}
              rows={3}
              onChange={handleChange}
            />
          </div>
          {context === "resources" && (
            <div className="-mt-10 mb-4">
              <Label
                htmlFor="projectNames"
                value={t("OnProjects")}
                className="font-semibold text-base"
              />
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.projectNames.join(", ")}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>{t("Save")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ComponentResourceCardDetails;

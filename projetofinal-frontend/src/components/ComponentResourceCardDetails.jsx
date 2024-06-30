import React, { useState } from "react";
import { Label, Modal, Button, TextInput, Textarea } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";

function ComponentResourceCardDetails({ data, context, onClose }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);

  const [formData, setFormData] = useState({
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

  let isAdmin = false;
  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.role === 200;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    const endpoint = context === "resources" ? "/resources" : "/components";
    const method = formData.id ? "PUT" : "POST";
    const url = `${apiUrl}${endpoint}`;
    console.log(formData);
    console.log(url);
    console.log(method);

    const payload = { ...formData };
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

      if (response.ok) {
        alert(
          `${context === "resources" ? "Resource" : "Component"} ${
            formData.id ? "updated" : "created"
          } successfully`
        );
        onClose();
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
          ? "Resource Information"
          : "Component Information"}
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 items-center justify-center">
          <div className="-mt-8">
            <Label
              htmlFor="name"
              value="Name"
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
              value="Description"
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
              value="Brand"
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
              value="Supplier"
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
              value="Identifier"
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
              value="Contact"
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
              value="Observation"
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
                value="On Projects:"
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
        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ComponentResourceCardDetails;

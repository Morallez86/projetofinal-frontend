import React, { useState } from "react";
import { Label, Modal, Button, TextInput, Textarea } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";

function ComponentResourceCardDetails({ data, context, onClose }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);

  const [formData, setFormData] = useState(data);

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
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          `${
            context === "resources" ? "Resource" : "Component"
          } updated successfully`
        );
        onClose();
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error(
        `Error updating ${context === "resources" ? "resource" : "component"}:`,
        error
      );
      alert(
        `An error occurred while updating the ${
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
          <div className="mt-4">
            <Label htmlFor="description" value="Description" />
            {isAdmin ? (
              <Textarea
                id="description"
                value={formData.description}
                rows={3}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.description}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="brand" value="Brand" />
            {isAdmin ? (
              <TextInput
                id="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.brand}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="supplier" value="Supplier" />
            {isAdmin ? (
              <TextInput
                id="supplier"
                value={formData.supplier}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.supplier}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="identifier" value="Identifier" />
            {isAdmin ? (
              <TextInput
                id="identifier"
                value={formData.identifier}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.identifier}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="contact" value="Contact" />
            {isAdmin ? (
              <TextInput
                id="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.contact}
              </p>
            )}
          </div>
          <div className="mt-4 mb-4">
            <Label htmlFor="observation" value="Observation" />
            {isAdmin ? (
              <Textarea
                id="observation"
                value={formData.observation}
                rows={3}
                onChange={handleChange}
              />
            ) : (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.observation}
              </p>
            )}
          </div>
          {context === "resources" && (
            <div className="mt-4 mb-4">
              <Label htmlFor="associationNumber" value="Association Number" />
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {formData.projectIds != null
                  ? formData.projectIds.length
                  : "No association"}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
      {isAdmin && (
        <Modal.Footer>
          <Button onClick={handleSave}>Save</Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default ComponentResourceCardDetails;

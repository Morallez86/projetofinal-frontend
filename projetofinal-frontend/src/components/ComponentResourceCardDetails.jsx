import React from "react";
import { Card, Label } from "flowbite-react";

function ComponentResourceCardDetails({ data, context, onClose }) {
  console.log(data.name);
  console.log(data.description);
  console.log(data.brand);
  console.log(data.supplier);
  console.log(data.identifier);
  console.log(data.contact);
  console.log(data.observation);
  console.log(data.projectIds);
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.name}
        </h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <Label htmlFor="description" value="Description" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.description}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="brand" value="Brand" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.brand}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="supplier" value="Supplier" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.supplier}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="identifier" value="Identifier" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.identifier}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="contact" value="Contact" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.contact}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="observation" value="Observation" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {data.observation}
            </p>
          </div>
          {context === "resources" && (
            <div className="mt-4">
              <Label htmlFor="associationNumber" value="Association Number" />
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {data.projectIds != null
                  ? data.projectIds.length
                  : "No association"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComponentResourceCardDetails;

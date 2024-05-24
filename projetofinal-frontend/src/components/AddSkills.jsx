import React from "react";
import { Dropdown, Modal } from "flowbite-react";
import CreatableSelect from "react-select/creatable";

function AddSkills({ openPopUpSkills, closePopUpSkills }) {
  const options = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    // Add more options here
  ];

  return (
    <>
      <Modal show={openPopUpSkills} size="xl" onClose={closePopUpSkills} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Skill
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">Create New Skill</h4>
                <div className="flex items-center">
                  <div className="text center">
                    <Dropdown label="Skill Category" dismissOnClick={true}>
                      <Dropdown.Item>Web Development</Dropdown.Item>
                      <Dropdown.Item>Mobile Development</Dropdown.Item>
                      <Dropdown.Item>Software Development</Dropdown.Item>
                      <Dropdown.Item>Graphic Design</Dropdown.Item>
                    </Dropdown>
                    <CreatableSelect options={options} className="mt-3" />
                  </div>
                </div>
              </div>
              <div>
                <h4>Add Existing Skill</h4>
                {/* Your form or content for adding an existing skill goes here */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddSkills;

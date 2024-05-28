import React from "react";
import { Modal, Button } from "flowbite-react";

function RemoveSkills({ openPopUpSkillsRemove, closePopUpSkillsRemove }) {
  return (
    <>
      <Modal
        show={openPopUpSkillsRemove}
        size="xl"
        onClose={() => {
          closePopUpSkillsRemove();
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Skill
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">
                  You can remove one or more skills at the same time{" "}
                </h4>
                <div className="flex items-center"></div>
                <div className="col-span-full mt-3">
                  <Button>Remove selected skills</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveSkills;

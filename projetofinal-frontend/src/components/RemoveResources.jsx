import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import { Checkbox, Label } from "flowbite-react";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";
import useProjectStore from "../Stores/ProjectStore";
import RemovedAnimation from "../Assets/Removed.json";

function RemoveResources({
  openPopUpResourcesRemove,
  closePopUpResourcesRemove,
}) {
  const projectResources = useProjectStore((state) => state.projectResources);
  const setProjectResources = useProjectStore(
    (state) => state.setProjectResources
  );

  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const filteredResources = projectResources.filter((resource) =>
    resource.name.toLowerCase().includes(filter.toLowerCase())
  );

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCheckboxChange = (idOrIndex) => {
    if (selectedResourceIds.includes(idOrIndex)) {
      setSelectedResourceIds(
        selectedResourceIds.filter((id) => id !== idOrIndex)
      );
    } else {
      setSelectedResourceIds([...selectedResourceIds, idOrIndex]);
    }
  };

  const handleRemoveResources = () => {
    const updatedProjectResources = projectResources.filter(
      (_, index) => !selectedResourceIds.includes(index)
    );
    setProjectResources(updatedProjectResources);
    setAnimationPlayed(true);
  };

  return (
    <>
      <Modal
        show={openPopUpResourcesRemove}
        size="xl"
        onClose={() => {
          closePopUpResourcesRemove();
          setSelectedResourceIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Resource
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>You can remove one or more resources at the same time</h4>
                <TextInput
                  type="text"
                  placeholder="Filter resources"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredResources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={index.toString()}
                        checked={selectedResourceIds.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <Label htmlFor={index.toString()}>{resource.name}</Label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRemoveResources}>
                  Remove selected resources
                </Button>
              </div>
              <div
                id="icon-element"
                className="pointer-events-none flex items-center justify-center h-full relative"
              >
                <Lottie
                  options={defaultOptions}
                  height={200}
                  width={200}
                  isStopped={!animationPlayed}
                  isPaused={!animationPlayed}
                  eventListeners={[
                    {
                      eventName: "complete",
                      callback: () => {
                        setAnimationPlayed(false);
                        setShowSuccessText(true);
                        setTimeout(() => setShowSuccessText(false), 1500);
                      },
                    },
                  ]}
                />
                {showSuccessText && (
                  <div className="animate-pulse text-green-500 font-bold absolute bottom-0 mb-4">
                    Removed with success
                  </div>
                )}
                <Tooltip
                  anchorSelect="#icon-element"
                  content="Click to delete this resource from your profile"
                  place="top"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveResources;

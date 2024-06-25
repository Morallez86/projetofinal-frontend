import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import { Checkbox, Label } from "flowbite-react";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";
import useProjectStore from "../Stores/ProjectStore";
import RemovedAnimation from "../Assets/Removed.json";

function RemoveComponents({
  openPopUpComponentsRemove,
  closePopUpComponentsRemove,
}) {
  const projectComponents = useProjectStore((state) => state.projectComponents);
  const setProjectComponents = useProjectStore(
    (state) => state.setProjectComponents
  );

  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedComponentIds, setSelectedComponentIds] = useState([]);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const filteredComponents = projectComponents.filter((component) =>
    component.name.toLowerCase().includes(filter.toLowerCase())
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
    if (selectedComponentIds.includes(idOrIndex)) {
      setSelectedComponentIds(
        selectedComponentIds.filter((id) => id !== idOrIndex)
      );
    } else {
      setSelectedComponentIds([...selectedComponentIds, idOrIndex]);
    }
  };

  const handleRemoveComponents = () => {
    const updatedProjectComponents = projectComponents.filter(
      (_, index) => !selectedComponentIds.includes(index)
    );
    setProjectComponents(updatedProjectComponents);
    setAnimationPlayed(true);
  };

  return (
    <>
      <Modal
        show={openPopUpComponentsRemove}
        size="xl"
        onClose={() => {
          closePopUpComponentsRemove();
          setSelectedComponentIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Component
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>You can remove one or more components at the same time</h4>
                <TextInput
                  type="text"
                  placeholder="Filter components"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredComponents.map((component, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={index.toString()}
                        checked={selectedComponentIds.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <Label htmlFor={index.toString()}>{component.name}</Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveComponents}
                  disabled={selectedComponentIds.length === 0}
                >
                  Remove selected components
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
                  content="Click to delete this component from your profile"
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

export default RemoveComponents;

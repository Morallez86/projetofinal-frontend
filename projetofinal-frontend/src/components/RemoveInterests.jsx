import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function RemoveInterests({
  openPopUpInterestRemove,
  closePopUpInterestRemove,
  context,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const userInterests = useUserStore((state) => state.interests);
  const projectInterests = useProjectStore((state) => state.projectInterests);
  const token = useUserStore((state) => state.token);
  const setUserInterests = useUserStore((state) => state.setInterests);
  const setProjectInterests = useProjectStore((state) => state.setProjectInterests);

  const [filter, setFilter] = useState("");
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const filteredInterests = (context === "user" ? userInterests : projectInterests).filter((interest) =>
    interest.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCheckboxChange = (idOrIndex) => {
    if (selectedInterestIds.includes(idOrIndex)) {
      setSelectedInterestIds(selectedInterestIds.filter((id) => id !== idOrIndex));
    } else {
      setSelectedInterestIds([...selectedInterestIds, idOrIndex]);
    }
  };

  const handleRemoveInterests = async () => {
    console.log(selectedInterestIds);
    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/interests`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedInterestIds),
        });
        if (response.status === 204) {
          const updatedInterests = userInterests.filter(
            (interest) => !selectedInterestIds.includes(interest.id)
          );
          setUserInterests(updatedInterests);
          setAnimationPlayed(true);
        } else if (response.status === 500) {
          console.log("Internet server error");
        }
      } catch (error) {
        console.error("Error deleting interests:", error);
      }
    } else {
      const updatedProjectInterests = projectInterests.filter(
        (_, index) => !selectedInterestIds.includes(index)
      );
      setProjectInterests(updatedProjectInterests);
      setAnimationPlayed(true);
    }
  };

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Modal
        show={openPopUpInterestRemove}
        size="xl"
        onClose={() => {
          closePopUpInterestRemove();
          setSelectedInterestIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Interest
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>You can remove one or more interests at the same time</h4>
                <TextInput
                  type="text"
                  placeholder="Filter interests"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredInterests.map((interest, index) => (
                    <div
                      key={context === "user" ? interest.id : index}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={
                          context === "user"
                            ? interest.id.toString()
                            : index.toString()
                        }
                        checked={selectedInterestIds.includes(
                          context === "user" ? interest.id : index
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            context === "user" ? interest.id : index
                          )
                        }
                      />
                      <Label
                        htmlFor={
                          context === "user"
                            ? interest.id.toString()
                            : index.toString()
                        }
                      >
                        {interest.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                onClick={handleRemoveInterests} 
                disabled={selectedInterestIds.length === 0}
                >
                  Remove selected interests
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
                  content="Click to delete this interest from your profile"
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

export default RemoveInterests;

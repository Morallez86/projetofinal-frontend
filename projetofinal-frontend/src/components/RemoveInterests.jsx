import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function RemoveInterests({
  openPopUpInterestRemove,
  closePopUpInterestRemove,
}) {
  const userInterests = useUserStore((state) => state.interests);
  const token = useUserStore((state) => state.token);
  const setInterests = useUserStore((state) => state.setInterests);
  const apiUrl = useApiStore((state) => state.apiUrl);
  console.log(userInterests);

  const [filter, setFilter] = useState("");
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const filteredInterest = userInterests.filter((interest) =>
    interest.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCheckboxChange = (interestID) => {
    if (selectedInterestIds.includes(interestID)) {
      setSelectedInterestIds(
        selectedInterestIds.filter((id) => id !== interestID)
      );
    } else {
      setSelectedInterestIds([...selectedInterestIds, interestID]);
    }
  };

  const handleRemoveInterests = async () => {
    console.log(selectedInterestIds);
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
        console.log();
        const updatedInterest = userInterests.filter(
          (interest) => !selectedInterestIds.includes(interest.id)
        );
        setInterests(updatedInterest);
        setAnimationPlayed(true);
      } else if (response.status === 500) {
        console.log("Internet server error");
      }
    } catch (error) {
      console.error("Error deleting interests:", error);
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
                  {filteredInterest.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-2">
                      <Checkbox
                        id={interest.id ? interest.id.toString() : ""}
                        checked={selectedInterestIds.includes(interest.id)}
                        onChange={() => handleCheckboxChange(interest.id)}
                      />
                      <Label
                        htmlFor={interest.id ? interest.id.toString() : ""}
                      >
                        {interest.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRemoveInterests}>
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
                  content="Click to delete this skill from your profile"
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

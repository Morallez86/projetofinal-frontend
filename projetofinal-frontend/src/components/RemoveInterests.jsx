import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from '../Stores/ApiStore';

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
      const response = await fetch(
        `${apiUrl}/interests`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedInterestIds),
        }
      );
      if (response.status === 204) {
        console.log();
        const updatedInterest = userInterests.filter(
          (interest) => !selectedInterestIds.includes(interest.id)
        );
        setInterests(updatedInterest);
        closePopUpInterestRemove();
      } else if (response.status === 500) {
        console.log("Internet server error");
      }
    } catch (error) {
      console.error("Error deleting interests:", error);
    }
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
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Interest
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">
                  You can remove one or more interests at the same time{" "}
                </h4>
                <TextInput
                  type="text"
                  placeholder="Filter interests"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mb-3"
                />
                <div className="flex flex-col items-start overflow-y-auto h-36">
                  {filteredInterest.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-center gap-2 mb-2"
                    >
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
                <div className="col-span-full mt-3">
                  <Button onClick={handleRemoveInterests}>
                    Remove selected interests
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveInterests;

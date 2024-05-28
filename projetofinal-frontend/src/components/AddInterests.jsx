import React from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import useUserStore from "../Stores/UserStore";
import { TbLockFilled } from "react-icons/tb";

function AddInterests({ openPopUpInterests, closePopUpInterests }) {
  const token = useUserStore((state) => state.token);
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const userInterests = useUserStore((state) => state.interests);

  useEffect(() => {
    getAllInterests();
  }, []);

  const getAllInterests = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/interests",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setInterests(data);
        console.log(data);
      } else if (response.status === 404) {
        console.log("Interests not found");
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  const options = interests.map((interest) => ({
    value: interest.name,
    label: interest.name,
    isDisabled: userInterests.includes(interest.name),
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedInterest(selectedOption);
  };

  return (
    <>
      <Modal show={openPopUpInterests} size="xl" onClose={closePopUpInterests} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Register Interest
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-3">
                  Create new interest or Choose one of the existing ones{" "}
                </h4>
                <div className="flex items-center">
                  <div className="text center">
                    <CreatableSelect
                      options={options}
                      className="mt-3"
                      onChange={handleSelectChange}
                      isOptionDisabled={(option) => option.isDisabled}
                      formatOptionLabel={(option) => (
                        <div>
                          {option.label}
                          {option.isDisabled ? <TbLockFilled /> : null}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-full mt-3">
                  <Button>Add to interests list</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddInterests;

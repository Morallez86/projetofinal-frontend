import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import { Checkbox, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import RemovedAnimation from "../Assets/Removed.json";
import Lottie from "react-lottie";
import { Tooltip } from "react-tooltip";

function RemoveUsers({ openPopUpUserRemove, closePopUpUserRemove, context }) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const userContacts = useUserStore((state) => state.contacts);
  const projectMembers = useProjectStore((state) => state.projectMembers);
  const token = useUserStore((state) => state.token);
  const setUserContacts = useUserStore((state) => state.setContacts);
  const setProjectMembers = useProjectStore((state) => state.setProjectMembers);

  const [filter, setFilter] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  useEffect(() => {
    console.log("User contacts:", userContacts);
    console.log("Project members:", projectMembers);
  }, [userContacts, projectMembers]);

  const filteredUsers =
    (context === "user" ? userContacts : projectMembers)?.filter((user) =>
      user.username.toLowerCase().includes(filter.toLowerCase())
    ) || [];

  const handleCheckboxChange = (idOrIndex) => {
    if (selectedUserIds.includes(idOrIndex)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== idOrIndex));
    } else {
      setSelectedUserIds([...selectedUserIds, idOrIndex]);
    }
  };

  const handleRemoveUsers = async () => {
    console.log(selectedUserIds);
    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/users`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedUserIds),
        });
        if (response.status === 204) {
          const updatedContacts = userContacts.filter(
            (user) => !selectedUserIds.includes(user.id)
          );
          setUserContacts(updatedContacts);
          setAnimationPlayed(true);
        } else if (response.status === 500) {
          console.log("Internet server error");
        }
      } catch (error) {
        console.error("Error deleting users:", error);
      }
    } else {
      const updatedProjectMembers = projectMembers.filter(
        (_, index) => !selectedUserIds.includes(index)
      );
      setProjectMembers(updatedProjectMembers);
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
        show={openPopUpUserRemove}
        size="xl"
        onClose={() => {
          closePopUpUserRemove();
          setSelectedUserIds([]);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Remove Users
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4>You can remove one or more users at the same time</h4>
                <TextInput
                  type="text"
                  placeholder="Filter users"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col items-start overflow-y-auto h-36 space-y-2">
                  {filteredUsers.map((user, index) => (
                    <div
                      key={context === "user" ? user.id : index}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={
                          context === "user"
                            ? user.id.toString()
                            : index.toString()
                        }
                        checked={selectedUserIds.includes(
                          context === "user" ? user.id : index
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            context === "user" ? user.id : index
                          )
                        }
                      />
                      <Label
                        htmlFor={
                          context === "user"
                            ? user.id.toString()
                            : index.toString()
                        }
                      >
                        {user.username}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRemoveUsers}>
                  Remove selected users
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
                  content="Click to delete this user from your profile"
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

export default RemoveUsers;

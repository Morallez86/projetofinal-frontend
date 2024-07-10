import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import { Checkbox, Label } from "flowbite-react";
import useProjectStore from "../Stores/ProjectStore";
import Lottie from "react-lottie";
import RemovedAnimation from "../Assets/Removed.json";

function RemoveUsers({ openPopUpUsersRemove, closePopUpUsersRemove }) {
  const projectUsers = useProjectStore((state) => state.projectUsers); //utilizadores do projeto
  const setProjectUsers = useProjectStore((state) => state.setProjectUsers);  //set dos utilizadores do projeto

  const [animationPlayed, setAnimationPlayed] = useState(false); //estado para controlar a animação
  const [filter, setFilter] = useState(""); //estado para filtro
  const [selectedUserIds, setSelectedUserIds] = useState([]); //estado para utilizadores selecionados
  const [showSuccessText, setShowSuccessText] = useState(false); //estado para mostrar texto de sucesso
  const filteredUsers = projectUsers.filter((user) =>
    user.username.toLowerCase().includes(filter.toLowerCase()) //filtrar utilizadores
  );

  const handleCheckboxChange = (idOrIndex) => { //função para selecionar/deselecionar utilizadores
    if (selectedUserIds.includes(idOrIndex)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== idOrIndex));
    } else {
      setSelectedUserIds([...selectedUserIds, idOrIndex]);
    }
  };

  const defaultOptions = { //opções para a animação
    loop: false,
    autoplay: false,
    animationData: RemovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleRemoveUsers = () => { //função para remover utilizadores
    const updatedProjectUsers = projectUsers.filter(
      (_, index) => !selectedUserIds.includes(index)
    );
    setProjectUsers(updatedProjectUsers);
    setAnimationPlayed(true);
  };

  return (
    <>
      <Modal
        show={openPopUpUsersRemove}
        size="xl"
        onClose={() => {
          closePopUpUsersRemove();
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
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={index.toString()}
                        checked={selectedUserIds.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <Label htmlFor={index.toString()}>{user.username}</Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleRemoveUsers}
                  disabled={selectedUserIds.length === 0}
                >
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
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RemoveUsers;

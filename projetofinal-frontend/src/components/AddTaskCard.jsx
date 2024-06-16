import React from "react";
import AddedAnimation from "../Assets/Added.json";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import Lottie from "react-lottie";
import Select from "react-select";
import { useParams } from "react-router-dom";


function AddTaskCard({ popUpShow, setPopUpShow }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const {projectId} = useParams();


  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async () => {
    setAnimationPlayed(true);
    setShowSuccessText(true);
    setTimeout(() => {
      setPopUpShow(false);
      setShowSuccessText(false);
    }, 2000);
  };

  return (
    <Modal
      show={popUpShow}
      size="xl"
      onClose={() => {
        setPopUpShow(false);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            Create a task
          </h3>
          <form className="space-y-3">
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="title" value="Task tile" />
                <TextInput
                  placeholder="Choose a title for the task"
                  id="title"
                  name="title"
                  defaultValue={""}
                />
              </div>
              <div>
                <Label htmlFor="description" value="Task description" />
                <Textarea
                  id="description"
                  name="description"
                  className="h-[10rem] resize-none"
                  defaultValue={""}
                />
              </div>
              <div>
                <Label htmlFor="responsible" value="Responsible" />
                <Select
                  options={""}
                  placeholder="Select a responsible"
                  maxMenuHeight={160}
                />
              </div>
              <div>
                <Label
                  htmlFor="plannedStartingDate"
                  value="Planned Starting Date"
                />
                <TextInput
                  id="plannedStartingDate"
                  name="plannedStartingDate"
                  type="date"
                  defaultValue={""}
                />
              </div>
              <div>
                <Label
                  htmlFor="plannedEndingDate"
                  value="Planned Ending Date"
                />
                <TextInput
                  id="plannedEndingDate"
                  name="plannedEndingDate"
                  type="date"
                  defaultValue={""}
                />
              </div>
              <div>
                <Label htmlFor="priority" value="Priority" />
                <Select
                  options={[
                    { value: 100, label: "Low" },
                    { value: 200, label: "Medium" },
                    { value: 300, label: "High" },
                  ]}
                  placeholder="Select a priority"
                  maxMenuHeight={160}
                />
                </div>
            </div>
            <div className="flex justify-center items-center space-x-2 mt-0">
              <Button onClick={handleSubmit}>Add task</Button>
              <div
                id="icon-element"
                className="pointer-events-none flex items-center justify-center"
                style={{
                  zIndex: 1,
                  transform: "scale(0.7)",
                }}
              >
                <Lottie
                  options={defaultOptions}
                  height={250}
                  width={250}
                  isStopped={!animationPlayed}
                  isPaused={!animationPlayed}
                  eventListeners={[
                    {
                      eventName: "complete",
                      callback: () => {
                        setAnimationPlayed(false);
                      },
                    },
                  ]}
                />
              </div>
              {showSuccessText && (
                <div className="animate-pulse text-green-500 font-bold">
                  Added with success
                </div>
              )}
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddTaskCard;

import React from "react";
import AddedAnimation from "../Assets/Added.json";
import { Modal, Button } from "flowbite-react";
import { useState } from "react";
import useUserStore from "../Stores/UserStore";
import  useApiStore  from "../Stores/ApiStore";
import Lottie from "react-lottie";


function AddTaskCard({ popUpShow, setPopUpShow }) {
    const token = useUserStore((state) => state.token);
    const apiUrl = useApiStore((state) => state.apiUrl);
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const [showSuccessText, setShowSuccessText] = useState(false);
    

    

  
   
  
    /*const options = resources.map((resource) => ({
      value: resource.name,
      label: resource.name,
      id: resource.id,
      isDisabled: projectResources.some(
        (projectResource) => projectResource.name === resource.name
      ),
    }));*/
  
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
          <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Create a task
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-4 min-h-[25rem] relative">
                <div className="text center z-10">
                </div>
                <div
                  id="icon-element"
                  className="pointer-events-none flex items-center justify-center h-full absolute"
                  style={{
                    zIndex: 1,
                    left: 0,
                    right: 0,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div style={{ transform: "scale(3.5)" }}>
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
                            setTimeout(() => setShowSuccessText(false), 500);
                          },
                        },
                      ]}
                    />
                  </div>
                  {showSuccessText && (
                    <div className="animate-pulse text-green-500 font-bold absolute bottom-0">
                      Added with success
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={handleSubmit}>
                  Add task
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
}

export default AddTaskCard;
